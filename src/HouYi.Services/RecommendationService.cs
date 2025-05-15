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

    protected async Task<PagedResult<Recommendation>> GetRecommendationsCoreAsync(
        Func<IQueryable<Recommendation>, IQueryable<Recommendation>>? filter,
        int? positionId = null,
        int pageNumber = 1,
        int pageSize = 10,
        RecommendationStatus? status = null,
        HiringStatus? hiringStatus = null)
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

        if (status.HasValue)
        {
            query = query.Where(r => r.Status == status.Value);
        }

        if (hiringStatus.HasValue)
        {
            query = query.Where(r => r.HiringStatus == hiringStatus.Value);
        }

        query = filter != null ? filter(query) : query;

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Recommendation>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<PagedResult<Recommendation>> GetRecommendationsAsync(
        int? positionId = null,
        int pageNumber = 1,
        int pageSize = 10,
        string? searchTerm = null,
        RecommendationStatus? status = null,
        HiringStatus? hiringStatus = null)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return await GetRecommendationsCoreAsync(filter: null, positionId, pageNumber, pageSize, status, hiringStatus);
        }

        return await GetRecommendationsCoreAsync(filter, positionId, pageNumber, pageSize, status, hiringStatus);

        IQueryable<Recommendation> filter(IQueryable<Recommendation> query)
        {
            searchTerm = searchTerm.Trim();
            return query.Where(r =>
                r.Resume.Name.Contains(searchTerm) ||
                r.Resume.Position.Contains(searchTerm) ||
                r.Reason.Contains(searchTerm) ||
                (r.Feedback != null && r.Feedback.Contains(searchTerm)));
        }
    }

    public async Task DeleteRecommendationAsync(int recommendationId)
    {
        var recommendation = await _dbContext.Recommendations
            .FirstOrDefaultAsync(r => r.Id == recommendationId);

        if (recommendation == null)
            throw new ArgumentException($"未找到ID为 {recommendationId} 的推荐记录");

        int interviewsCount = await _dbContext.Interviews
            .CountAsync(i => i.RecommendationId == recommendationId);
        if (interviewsCount > 0)
            throw new InvalidOperationException($"无法删除推荐，因为该推荐还有 {interviewsCount} 条面试记录。请先处理这些面试记录后再删除这条推荐记录。");

        _dbContext.Recommendations.Remove(recommendation);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateRecommendationAsync(int recommendationId, RecommendationStatus status, string feedback)
    {
        var recommendation = await _dbContext.Recommendations
            .FirstOrDefaultAsync(r => r.Id == recommendationId);

        if (recommendation == null)
            throw new ArgumentException($"未找到ID为 {recommendationId} 的推荐记录");

        recommendation.Status = status;
        recommendation.Feedback = feedback;
        recommendation.UpdatedAt = DateTime.Now;

        await _dbContext.SaveChangesAsync();
    }
} 