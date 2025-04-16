using HouYi.Models;

namespace HouYi.Services;

public interface ICustomerService
{
    Task<PagedResult<Customer>> GetCustomersAsync(int pageNumber = 1, int pageSize = 10);
    Task<PagedResult<Customer>> FindCustomersAsync(string field = "", string term = "", int pageNumber = 1, int pageSize = 10);
}