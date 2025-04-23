using HouYi.Models;

namespace HouYi.Services;

public interface IRecommendationService
{
    Task<PagedResult<Recommendation>> GetRecommendationsAsync(int? positionId, int pageNumber = 1, int pageSize = 10, string? candidateName = null);
}