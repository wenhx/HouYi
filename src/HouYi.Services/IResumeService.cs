using HouYi.Infrastructure;
using HouYi.Models;
using HouYi.Models.Resumes;

namespace HouYi.Services;

public interface IResumeService
{
    Task<PagedResult<Resume>> GetResumesAsync(
        int pageIndex,
        int pageSize,
        string? searchField = null,
        string? searchTerm = null,
        Gender? gender = null,
        CurrentStatus? currentStatus = null,
        Degree? degree = null,
        ResumeSource? source = null);

    Task<InvokedResult> UpdateResumePropertyAsync<T>(string id, string propertyName, T value);

    Task<bool> DeleteResumeAsync(string id);
}
