using HouYi.Models;

namespace HouYi.Services;

public interface ICustomerService
{
    Task<PagedResult<Customer>> GetCustomersAsync(int pageNumber = 1, int pageSize = 10);
}