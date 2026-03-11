using HouYi.Models;

namespace HouYi.Services;

public interface IReferenceDataService
{
    Task<PagedResult<ReferenceData>> GetReferenceDataAsync(string? category, string? keyword, int pageNumber = 1, int pageSize = 10);
    Task<IReadOnlyList<string>> GetCategoriesAsync();
    Task<ReferenceData> CreateAsync(ReferenceData referenceData);
    Task UpdateAsync(ReferenceData referenceData);
    Task SoftDeleteAsync(int id);
}
