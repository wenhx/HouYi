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

    public async Task<Recommendation> CreateRecommendationAsync(Recommendation recommendation)
    {
        if (recommendation == null)
            throw new ArgumentNullException(nameof(recommendation), "推荐记录不能为空");

        if (string.IsNullOrEmpty(recommendation.ResumeId))
            throw new ArgumentException("简历ID不能为空", nameof(recommendation));

        if (recommendation.PositionId <= 0)
            throw new ArgumentException("职位ID必须大于0", nameof(recommendation));

        if (string.IsNullOrEmpty(recommendation.Reason))
            throw new ArgumentException("推荐理由不能为空", nameof(recommendation));

        // 验证简历是否存在
        var resumeExists = await _dbContext.Resumes.AnyAsync(r => r.Id == recommendation.ResumeId);
        if (!resumeExists)
            throw new ArgumentException($"未找到ID为 {recommendation.ResumeId} 的简历", nameof(recommendation));

        // 验证职位是否存在且处于开放状态
        var position = await _dbContext.Positions
            .FirstOrDefaultAsync(p => p.Id == recommendation.PositionId);
        if (position == null)
            throw new ArgumentException($"未找到ID为 {recommendation.PositionId} 的职位", nameof(recommendation));
        if (position.Status != PositionStatus.Open)
            throw new ArgumentException($"职位 {position.Name} 当前不处于开放状态", nameof(recommendation));

        // 验证是否已经推荐过
        var existingRecommendation = await _dbContext.Recommendations
            .AnyAsync(r => r.ResumeId == recommendation.ResumeId && r.PositionId == recommendation.PositionId);
        if (existingRecommendation)
            throw new InvalidOperationException($"该候选人已经被推荐过此职位");

        _dbContext.Recommendations.Add(recommendation);
        await _dbContext.SaveChangesAsync();
        return recommendation;
    }
} 