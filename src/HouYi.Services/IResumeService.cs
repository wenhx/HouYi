using HouYi.Models;

namespace HouYi.Services;

public interface IResumeService
{
    Task<PagedResult<Resume>> GetResumesAsync(int pageNumber = 1, int pageSize = 10, Gender? gender = null, EmploymentStatus? status = null);
    Task<PagedResult<Resume>> FindResumesAsync(string field = "", string term = "", int pageNumber = 1, int pageSize = 10, Gender? gender = null, EmploymentStatus? status = null);
}