using HouYi.Data;
using HouYi.Models;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HouYi.Services;

public class OperationLogService : IOperationLogService
{
    private readonly IDbContextFactory<HouYiDbContext> _dbContextFactory;
    private readonly AuthenticationStateProvider _authenticationStateProvider;

    public OperationLogService(
        IDbContextFactory<HouYiDbContext> dbContextFactory,
        AuthenticationStateProvider authenticationStateProvider)
    {
        _dbContextFactory = dbContextFactory;
        _authenticationStateProvider = authenticationStateProvider;
    }

    public async Task AddAsync(OperationLog log)
    {
        if (log == null)
            throw new ArgumentNullException(nameof(log), "log不能为空");

        if (log.UserId <= 0 || string.IsNullOrWhiteSpace(log.UserName))
        {
            var currentUser = await GetCurrentUserAsync();
            if (log.UserId <= 0)
                log.UserId = currentUser.UserId;
            if (string.IsNullOrWhiteSpace(log.UserName))
                log.UserName = currentUser.UserName;
        }

        if (log.CreatedAt == default)
            log.CreatedAt = DateTime.Now;

        using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
        dbContext.OperationLogs.Add(log);
        await dbContext.SaveChangesAsync();
    }

    public async Task<PagedResult<OperationLog>> GetLogsAsync(OperationLogQuery query, int pageNumber = 1, int pageSize = 10)
    {
        await EnsureAdminAsync();
        Utils.NormalizePaginationInputs(ref pageNumber, ref pageSize);

        using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
        var logs = dbContext.OperationLogs.AsNoTracking().AsQueryable();

        if (query.StartDate.HasValue)
        {
            logs = logs.Where(l => l.CreatedAt >= query.StartDate.Value);
        }
        if (query.EndDate.HasValue)
        {
            logs = logs.Where(l => l.CreatedAt <= query.EndDate.Value);
        }
        if (!string.IsNullOrWhiteSpace(query.Module))
        {
            logs = logs.Where(l => l.Module.Contains(query.Module));
        }
        if (!string.IsNullOrWhiteSpace(query.Action))
        {
            logs = logs.Where(l => l.Action.Contains(query.Action));
        }
        if (query.Result.HasValue)
        {
            logs = logs.Where(l => l.Result == query.Result.Value);
        }
        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var keyword = query.Keyword.Trim();
            logs = logs.Where(l =>
                l.Message.Contains(keyword) ||
                l.EntityId.Contains(keyword) ||
                (l.UserName != null && l.UserName.Contains(keyword)));
        }

        var totalCount = await logs.CountAsync();
        var items = await logs
            .OrderByDescending(l => l.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<OperationLog>(items, pageNumber, pageSize, totalCount);
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
            throw new UnauthorizedAccessException("未登录用户无权限记录日志。");

        var userIdValue = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdValue, out var userId))
            throw new InvalidOperationException("无法获取用户ID。");

        return (userId, user.Identity?.Name);
    }
}
