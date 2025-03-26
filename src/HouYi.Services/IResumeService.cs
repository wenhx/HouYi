using HouYi.Models.Resumes;

namespace HouYi.Services;

public interface IResumeService
{
    Task<PagedResult<Resume>> GetResumesAsync(int pageIndex, int pageSize);
    Task<bool> UpdateResumePropertyAsync<T>(string id, string propertyName, T value);
    Task<bool> DeleteResumeAsync(string id);
}
