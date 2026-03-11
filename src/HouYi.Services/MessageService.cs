using HouYi.Data;
using HouYi.Models;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;

namespace HouYi.Services;

public class MessageService : IMessageService
{
    private readonly IDbContextFactory<HouYiDbContext> _dbContextFactory;
    private readonly AuthenticationStateProvider _authenticationStateProvider;
    private readonly IServiceScopeFactory _scopeFactory;

    public MessageService(
        IDbContextFactory<HouYiDbContext> dbContextFactory,
        AuthenticationStateProvider authenticationStateProvider,
        IServiceScopeFactory scopeFactory)
    {
        _dbContextFactory = dbContextFactory;
        _authenticationStateProvider = authenticationStateProvider;
        _scopeFactory = scopeFactory;
    }

    public async Task<PagedResult<UserMessageDto>> GetMyMessagesAsync(MessageQuery query, int pageNumber = 1, int pageSize = 10)
    {
        Utils.NormalizePaginationInputs(ref pageNumber, ref pageSize);
        var (userId, _) = await GetCurrentUserAsync();

        using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
        var messages = from m in dbContext.Messages.AsNoTracking()
                       join c in dbContext.MessageContents.AsNoTracking() on m.ContentId equals c.Id
                       join s in dbContext.Users.AsNoTracking() on m.SenderId equals s.Id into senderJoin
                       from s in senderJoin.DefaultIfEmpty()
                       where m.ReceiverId == userId
                       select new { m, c, s };

        if (query.Type.HasValue)
        {
            messages = messages.Where(x => x.c.ContentType == query.Type.Value);
        }
        if (query.ReadStatus.HasValue)
        {
            messages = messages.Where(x => x.m.ReadStatus == query.ReadStatus.Value);
        }
        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var keyword = query.Keyword.Trim();
            messages = messages.Where(x => x.c.Title.Contains(keyword) || x.c.Content.Contains(keyword));
        }
        if (query.StartDate.HasValue)
        {
            messages = messages.Where(x => x.m.SentAt >= query.StartDate.Value);
        }
        if (query.EndDate.HasValue)
        {
            messages = messages.Where(x => x.m.SentAt <= query.EndDate.Value);
        }

        var totalCount = await messages.CountAsync();
        var items = await messages
            .OrderByDescending(x => x.m.SentAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new UserMessageDto
            {
                Id = x.m.Id,
                Title = x.c.Title,
                Content = x.c.Content,
                ContentType = x.c.ContentType,
                SenderName = x.s != null ? x.s.UserName ?? string.Empty : string.Empty,
                SentAt = x.m.SentAt,
                ReadStatus = x.m.ReadStatus,
                ReadAt = x.m.ReadAt
            })
            .ToListAsync();

        return new PagedResult<UserMessageDto>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<int> GetUnreadCountAsync()
    {
        var (userId, _) = await GetCurrentUserAsync();
        using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
        return await dbContext.Messages.AsNoTracking()
            .CountAsync(m => m.ReceiverId == userId && m.ReadStatus == MessageReadStatus.Unread);
    }

    public async Task MarkAsReadAsync(int messageId)
    {
        var (userId, _) = await GetCurrentUserAsync();
        using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
        var message = await dbContext.Messages.FirstOrDefaultAsync(m => m.Id == messageId && m.ReceiverId == userId);
        if (message == null)
            throw new InvalidOperationException("消息不存在或无权限访问。");

        if (message.ReadStatus == MessageReadStatus.Read)
            return;

        message.ReadStatus = MessageReadStatus.Read;
        message.ReadAt = DateTime.Now;
        await dbContext.SaveChangesAsync();
    }

    public async Task MarkAllAsReadAsync()
    {
        var (userId, _) = await GetCurrentUserAsync();
        using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
        var messages = await dbContext.Messages
            .Where(m => m.ReceiverId == userId && m.ReadStatus == MessageReadStatus.Unread)
            .ToListAsync();

        if (!messages.Any())
            return;

        var now = DateTime.Now;
        foreach (var message in messages)
        {
            message.ReadStatus = MessageReadStatus.Read;
            message.ReadAt = now;
        }

        await dbContext.SaveChangesAsync();
    }

    public async Task<MessageSendResult> SendToAllAsync(MessageSendRequest request)
    {
        await EnsureAdminAsync();
        var (userId, _) = await GetCurrentUserAsync();

        using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
        var users = await dbContext.Users.AsNoTracking().ToListAsync();
        if (!users.Any())
        {
            return new MessageSendResult { Total = 0, Success = 0, Failed = 0, Message = "没有可发送的用户。" };
        }

        var content = new MessageContent
        {
            Title = request.Title.Trim(),
            Content = request.Content.Trim(),
            ContentType = request.Type,
            CreatedAt = DateTime.Now
        };

        dbContext.MessageContents.Add(content);
        await dbContext.SaveChangesAsync();

        var sentAt = DateTime.Now;
        var messages = users.Select(user => new Message
        {
            ReceiverId = user.Id,
            SenderId = userId,
            ContentId = content.Id,
            SendStatus = MessageSendStatus.Sent,
            ReadStatus = MessageReadStatus.Unread,
            SentAt = sentAt
        }).ToList();

        dbContext.Messages.AddRange(messages);
        await dbContext.SaveChangesAsync();

        return new MessageSendResult
        {
            Total = messages.Count,
            Success = messages.Count,
            Failed = 0
        };
    }

    public async Task<MessageSendResult> SendToRoleAsync(string roleName, MessageSendRequest request)
    {
        await EnsureAdminAsync();
        if (string.IsNullOrWhiteSpace(roleName))
            throw new InvalidOperationException("请选择角色。");

        var (userId, _) = await GetCurrentUserAsync();
        using IServiceScope scope = _scopeFactory.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<HouYiUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
        if (!await roleManager.RoleExistsAsync(roleName))
            throw new InvalidOperationException("角色不存在。");

        var users = await userManager.GetUsersInRoleAsync(roleName);
        if (users.Count == 0)
        {
            return new MessageSendResult { Total = 0, Success = 0, Failed = 0, Message = "角色下没有可发送的用户。" };
        }

        using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
        var content = new MessageContent
        {
            Title = request.Title.Trim(),
            Content = request.Content.Trim(),
            ContentType = request.Type,
            CreatedAt = DateTime.Now
        };

        dbContext.MessageContents.Add(content);
        await dbContext.SaveChangesAsync();

        var sentAt = DateTime.Now;
        var messages = users.Select(user => new Message
        {
            ReceiverId = user.Id,
            SenderId = userId,
            ContentId = content.Id,
            SendStatus = MessageSendStatus.Sent,
            ReadStatus = MessageReadStatus.Unread,
            SentAt = sentAt
        }).ToList();

        dbContext.Messages.AddRange(messages);
        await dbContext.SaveChangesAsync();

        return new MessageSendResult
        {
            Total = messages.Count,
            Success = messages.Count,
            Failed = 0
        };
    }

    public async Task<PagedResult<AdminMessageDto>> GetAllMessagesAsync(MessageAdminQuery query, int pageNumber = 1, int pageSize = 10)
    {
        await EnsureAdminAsync();
        Utils.NormalizePaginationInputs(ref pageNumber, ref pageSize);

        using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
        var messages = from m in dbContext.Messages.AsNoTracking()
                       join c in dbContext.MessageContents.AsNoTracking() on m.ContentId equals c.Id
                       join r in dbContext.Users.AsNoTracking() on m.ReceiverId equals r.Id
                       join s in dbContext.Users.AsNoTracking() on m.SenderId equals s.Id into senderJoin
                       from s in senderJoin.DefaultIfEmpty()
                       select new { m, c, r, s };

        if (query.Type.HasValue)
        {
            messages = messages.Where(x => x.c.ContentType == query.Type.Value);
        }
        if (query.ReadStatus.HasValue)
        {
            messages = messages.Where(x => x.m.ReadStatus == query.ReadStatus.Value);
        }
        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var keyword = query.Keyword.Trim();
            messages = messages.Where(x => x.c.Title.Contains(keyword) || x.c.Content.Contains(keyword));
        }
        if (!string.IsNullOrWhiteSpace(query.ReceiverKeyword))
        {
            var keyword = query.ReceiverKeyword.Trim();
            messages = messages.Where(x => x.r.UserName != null && x.r.UserName.Contains(keyword));
        }
        if (query.StartDate.HasValue)
        {
            messages = messages.Where(x => x.m.SentAt >= query.StartDate.Value);
        }
        if (query.EndDate.HasValue)
        {
            messages = messages.Where(x => x.m.SentAt <= query.EndDate.Value);
        }

        var totalCount = await messages.CountAsync();
        var items = await messages
            .OrderByDescending(x => x.m.SentAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new AdminMessageDto
            {
                Id = x.m.Id,
                ReceiverName = x.r.UserName ?? string.Empty,
                Title = x.c.Title,
                Content = x.c.Content,
                ContentType = x.c.ContentType,
                SenderName = x.s != null ? x.s.UserName ?? string.Empty : string.Empty,
                SentAt = x.m.SentAt,
                ReadStatus = x.m.ReadStatus
            })
            .ToListAsync();

        return new PagedResult<AdminMessageDto>(items, pageNumber, pageSize, totalCount);
    }

    private async Task EnsureAdminAsync()
    {
        var authState = await _authenticationStateProvider.GetAuthenticationStateAsync();
        var user = authState.User;
        if (user.Identity?.IsAuthenticated != true)
            throw new UnauthorizedAccessException("未登录用户无权限访问。");
        if (!user.IsInRole(Constants.Users.AdminRoleName))
            throw new UnauthorizedAccessException("需要管理员权限。");
    }

    private async Task<(int UserId, string? UserName)> GetCurrentUserAsync()
    {
        var authState = await _authenticationStateProvider.GetAuthenticationStateAsync();
        var user = authState.User;
        if (user.Identity?.IsAuthenticated != true)
            throw new UnauthorizedAccessException("未登录用户无权限访问。");

        var userIdValue = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdValue, out var userId))
            throw new InvalidOperationException("无法获取用户ID。");

        return (userId, user.Identity?.Name);
    }
}
