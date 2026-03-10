using HouYi.Data;
using HouYi.Models;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace HouYi.Services;

public class ReferenceDataService : IReferenceDataService
{
    private readonly IDbContextFactory<HouYiDbContext> _dbContextFactory;
    private readonly AuthenticationStateProvider _authenticationStateProvider;
    private readonly IOperationLogService _operationLogService;
    private readonly ILogger<ReferenceDataService> _logger;

    public ReferenceDataService(
        IDbContextFactory<HouYiDbContext> dbContextFactory,
        AuthenticationStateProvider authenticationStateProvider,
        IOperationLogService operationLogService,
        ILogger<ReferenceDataService> logger)
    {
        _dbContextFactory = dbContextFactory;
        _authenticationStateProvider = authenticationStateProvider;
        _operationLogService = operationLogService;
        _logger = logger;
    }

    public async Task<PagedResult<ReferenceData>> GetReferenceDataAsync(string? category, string? keyword, int pageNumber = 1, int pageSize = 10)
    {
        await EnsureAdminAsync();
        Utils.NormalizePaginationInputs(ref pageNumber, ref pageSize);

        using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
        var query = dbContext.ReferenceData
            .AsNoTracking()
            .Where(r => !r.IsDeleted);

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(r => r.Category == category);
        }

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            keyword = keyword.Trim();
            query = query.Where(r =>
                r.Name.Contains(keyword) ||
                r.Code.Contains(keyword) ||
                r.Description.Contains(keyword));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(r => r.Category)
            .ThenBy(r => r.SortOrder)
            .ThenBy(r => r.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<ReferenceData>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<IReadOnlyList<string>> GetCategoriesAsync()
    {
        await EnsureAdminAsync();

        using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
        var categories = await dbContext.ReferenceData
            .AsNoTracking()
            .Where(r => !r.IsDeleted)
            .Select(r => r.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return categories;
    }

    public async Task<ReferenceData> CreateAsync(ReferenceData referenceData)
    {
        await EnsureAdminAsync();
        Validate(referenceData);

        try
        {
            referenceData.UpdatedAt = DateTime.Now;
            using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
            dbContext.ReferenceData.Add(referenceData);
            await dbContext.SaveChangesAsync();

            await TryLogAsync(new OperationLog
            {
                Module = "数据字典",
                Action = "新增",
                EntityType = nameof(ReferenceData),
                EntityId = referenceData.Id.ToString(),
                Result = true,
                Message = $"新增字典项：{referenceData.Name}",
                AfterData = JsonSerializer.Serialize(referenceData)
            });
        }
        catch (Exception ex)
        {
            await TryLogAsync(new OperationLog
            {
                Module = "数据字典",
                Action = "新增",
                EntityType = nameof(ReferenceData),
                EntityId = referenceData.Id.ToString(),
                Result = false,
                Message = $"新增字典项失败：{ex.Message}",
                AfterData = JsonSerializer.Serialize(referenceData),
                ExtraData = JsonSerializer.Serialize(new { Error = ex.Message })
            });
            throw;
        }

        return referenceData;
    }

    public async Task UpdateAsync(ReferenceData referenceData)
    {
        await EnsureAdminAsync();
        Validate(referenceData);

        try
        {
            using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
            var existing = await dbContext.ReferenceData.FirstOrDefaultAsync(r => r.Id == referenceData.Id);
            if (existing == null)
                throw new InvalidOperationException("字典数据不存在。");

            var beforeData = JsonSerializer.Serialize(existing);
            existing.Name = referenceData.Name;
            existing.Code = referenceData.Code;
            existing.Category = referenceData.Category;
            existing.SortOrder = referenceData.SortOrder;
            existing.Description = referenceData.Description;
            existing.UpdatedAt = DateTime.Now;
            await dbContext.SaveChangesAsync();

            await TryLogAsync(new OperationLog
            {
                Module = "数据字典",
                Action = "编辑",
                EntityType = nameof(ReferenceData),
                EntityId = existing.Id.ToString(),
                Result = true,
                Message = $"编辑字典项：{existing.Name}",
                BeforeData = beforeData,
                AfterData = JsonSerializer.Serialize(existing)
            });
        }
        catch (Exception ex)
        {
            await TryLogAsync(new OperationLog
            {
                Module = "数据字典",
                Action = "编辑",
                EntityType = nameof(ReferenceData),
                EntityId = referenceData.Id.ToString(),
                Result = false,
                Message = $"编辑字典项失败：{ex.Message}",
                AfterData = JsonSerializer.Serialize(referenceData),
                ExtraData = JsonSerializer.Serialize(new { Error = ex.Message })
            });
            throw;
        }
    }

    public async Task SoftDeleteAsync(int id)
    {
        await EnsureAdminAsync();

        try
        {
            using HouYiDbContext dbContext = await _dbContextFactory.CreateDbContextAsync();
            var existing = await dbContext.ReferenceData.FirstOrDefaultAsync(r => r.Id == id);
            if (existing == null)
                throw new InvalidOperationException("字典数据不存在。");

            var beforeData = JsonSerializer.Serialize(existing);
            existing.IsDeleted = true;
            existing.UpdatedAt = DateTime.Now;
            await dbContext.SaveChangesAsync();

            await TryLogAsync(new OperationLog
            {
                Module = "数据字典",
                Action = "删除",
                EntityType = nameof(ReferenceData),
                EntityId = existing.Id.ToString(),
                Result = true,
                Message = $"删除字典项：{existing.Name}",
                BeforeData = beforeData,
                AfterData = JsonSerializer.Serialize(existing)
            });
        }
        catch (Exception ex)
        {
            await TryLogAsync(new OperationLog
            {
                Module = "数据字典",
                Action = "删除",
                EntityType = nameof(ReferenceData),
                EntityId = id.ToString(),
                Result = false,
                Message = $"删除字典项失败：{ex.Message}",
                ExtraData = JsonSerializer.Serialize(new { Error = ex.Message })
            });
            throw;
        }
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

    private static void Validate(ReferenceData referenceData)
    {
        if (referenceData == null)
            throw new ArgumentNullException(nameof(referenceData), "referenceData不能为空");

        var validationContext = new ValidationContext(referenceData);
        var validationResults = new List<ValidationResult>();
        if (!Validator.TryValidateObject(referenceData, validationContext, validationResults, true))
        {
            var errorMessages = validationResults.Select(r => r.ErrorMessage);
            throw new ArgumentException(string.Join(Environment.NewLine, errorMessages));
        }
    }

    private async Task TryLogAsync(OperationLog log)
    {
        try
        {
            await _operationLogService.AddAsync(log);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to write operation log. Module: {Module}, Action: {Action}, EntityType: {EntityType}, EntityId: {EntityId}",
                log.Module,
                log.Action,
                log.EntityType,
                log.EntityId);
        }
    }
}
