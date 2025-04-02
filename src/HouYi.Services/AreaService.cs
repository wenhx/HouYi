using HouYi.Data;
using HouYi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace HouYi.Services;

public abstract class AreaServiceBase(ILogger<AreaService> _logger) : IAreaService
{
    private static readonly ConcurrentDictionary<int, LeveledReferenceData> s_areaCache = new();
    private static readonly ConcurrentDictionary<int, LeveledReferenceData> s_level2AreaCache = new();
    private static readonly ConcurrentDictionary<int, LeveledReferenceData> s_level3AreaCache = new();

    public string? GetAreaName(int id)
    {
        return s_areaCache.TryGetValue(id, out var data) ? data.Name : null;
    }

    public async Task RefreshCacheAsync()
    {
        try
        {
            ClearCache();
            IEnumerable<LeveledReferenceData> areas = await GetAreasAsync();
            foreach (var area in areas)
            {
                s_areaCache.TryAdd(area.Id, area);
                if (area.Level == 2)
                {
                    s_level2AreaCache.TryAdd(area.Id, area);
                }
                else if (area.Level == 3)
                {
                    s_level3AreaCache.TryAdd(area.Id, area);
                }
            }

            _logger.LogInformation("Area cache refreshed with {count} areas", s_areaCache.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing area cache");
            throw;
        }
    }

    private static void ClearCache()
    {
        s_areaCache.Clear();
        s_level2AreaCache.Clear();
        s_level3AreaCache.Clear();
    }

    abstract protected Task<IEnumerable<LeveledReferenceData>> GetAreasAsync();
}

public class AreaService(HouYiDbContext _dbContext, ILogger<AreaService> logger) : AreaServiceBase(logger)
{
    protected override Task<IEnumerable<LeveledReferenceData>> GetAreasAsync()
    {
        IEnumerable<LeveledReferenceData> areas = _dbContext.LeveledReferenceData
                        .Where(x => x.Category == Constants.Categories.Area && !x.IsDeleted);
        return Task.FromResult(areas);
    }
}