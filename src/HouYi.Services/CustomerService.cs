using HouYi.Data;
using HouYi.Models;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Services;

public class CustomerService : ICustomerService
{
    private readonly HouYiDbContext _dbContext;

    public CustomerService(HouYiDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<Customer>> GetCustomersCoreAsync(Func<IQueryable<Customer>, IQueryable<Customer>>? filter, int pageNumber = 1, int pageSize = 10)
    {
        Utils.NormalizePaginationInputs(ref pageNumber, ref pageSize);

        var query = _dbContext.Customers.AsQueryable();
        query = filter != null ? filter(query) : query;

        var totalCount = await query.CountAsync();
        Console.WriteLine("Total Count: " + totalCount);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Customer>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<PagedResult<Customer>> GetCustomersAsync(int pageNumber = 1, int pageSize = 10)
    {
        return await GetCustomersCoreAsync(filter: null, pageNumber, pageSize);
    }

    public async Task<PagedResult<Customer>> FindCustomersAsync(string term = "", int pageNumber = 1, int pageSize = 10)
    {
        return await GetCustomersCoreAsync(filter, pageNumber, pageSize);

        IQueryable<Customer> filter(IQueryable<Customer> query)
        {
            if (!string.IsNullOrWhiteSpace(term))
            {
                term = term.Trim();
                query = query.Where(c =>
                    c.Name.Contains(term) ||
                    c.ContactPerson.Contains(term) ||
                    c.Phone.Contains(term) ||
                    c.Email.Contains(term) ||
                    c.Address.Contains(term)
                );
            }
            return query;
        }
    }
}