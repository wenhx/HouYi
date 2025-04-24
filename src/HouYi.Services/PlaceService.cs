using HouYi.Data;
using HouYi.Models;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Services;

public class PlaceService : IPlaceService
{
    private readonly HouYiDbContext _dbContext;

    public PlaceService(HouYiDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<Place>> GetChineseProvincesAsync()
    {
        var items = await _dbContext.Places
            .Where(p => !p.IsDeleted && p.ParentId == Constants.Places.ChinaId)
            .OrderBy(p => p.SortOrder)
            .ThenBy(p => p.Name)
            .ToListAsync();

        return items;
    }

    public async Task<IReadOnlyCollection<Place>> GetCitiesOfProvinceAsync(int provinceId)
    {
        var items = await _dbContext.Places
            .Where(p => !p.IsDeleted && p.ParentId == provinceId)
            .OrderBy(p => p.SortOrder)
            .ThenBy(p => p.Name)
            .ToListAsync();

        return items;
    }
} 