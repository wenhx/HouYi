using HouYi.Data;
using HouYi.Models;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Services;

public class RecommendationService : IRecommendationService
{
    private readonly HouYiDbContext _dbContext;

    public RecommendationService(HouYiDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<Recommendation>> GetRecommendationsAsync(int? positionId, int pageNumber = 1, int pageSize = 10, string? candiateName = null)
    {
        Utils.NormalizePaginationInputs(ref pageNumber, ref pageSize);

        IQueryable<Recommendation> query = _dbContext.Recommendations
            .Include(r => r.Resume)
            .ThenInclude(r => r.Place)
            .OrderByDescending(r => r.UpdatedAt);

        if (positionId.HasValue && positionId > 0)
        {
            query = query.Where(r => r.PositionId == positionId);
        }

        if (!string.IsNullOrWhiteSpace(candiateName))
        {
            candiateName = candiateName.Trim();
            query = query.Where(r => r.Resume.Name.Contains(candiateName));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Recommendation>(items, pageNumber, pageSize, totalCount);
    }
} 