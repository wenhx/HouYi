using HouYi.Models;

namespace HouYi.Services;

public interface IRecommendationService
{
    Task<PagedResult<Recommendation>> GetRecommendationsAsync(int? positionId, int pageNumber = 1, int pageSize = 10, string? candidateName = null);
    Task DeleteRecommendationAsync(int recommendationId);
    Task UpdateRecommendationAsync(int recommendationId, RecommendationStatus status, string feedback);
}