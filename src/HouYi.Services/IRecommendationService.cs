using HouYi.Models;

namespace HouYi.Services;

public interface IRecommendationService
{
    Task<PagedResult<Recommendation>> GetRecommendationsAsync(int? positionId = null, int pageNumber = 1, int pageSize = 10, string? searchTerm = null, RecommendationStatus? status = null, HiringStatus? hiringStatus = null);
    Task DeleteRecommendationAsync(int recommendationId);
    Task UpdateRecommendationAsync(int recommendationId, RecommendationStatus status, string feedback);
    Task<Recommendation> CreateRecommendationAsync(Recommendation recommendation);
}