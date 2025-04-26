using HouYi.Models;

namespace HouYi.Services;

public interface IInterviewService
{
    Task<List<Interview>> GetTodayInterviewsAsync();
    Task<PagedResult<Interview>> GetInterviewsAsync(int pageNumber, int pageSize);
    Task<PagedResult<Interview>> FindInterviewsAsync(string term, int pageNumber, int pageSize);
    Task<Interview> CreateInterviewAsync(Interview interview);
    Task<Interview> GetInterviewByIdAsync(int id);
    Task DeleteInterviewAsync(int id);
    Task<Interview> UpdateInterviewAsync(Interview interview);
}