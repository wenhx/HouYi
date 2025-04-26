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
            .OrderByDescending(c => c.UpdatedAt)
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

    public async Task DeleteCustomerAsync(int id)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var customer = await _dbContext.Customers
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer != null)
            {
                // 检查是否有相关的职位
                int positionCount = await _dbContext.Positions
                    .CountAsync(p => p.CustomerId == id);

                if (positionCount > 0)
                    throw new InvalidOperationException($"无法删除该客户，因为客户 {customer.Name} 还有 {positionCount} 个职位。请先处理这些职位后再进行删除。");

                _dbContext.Customers.Remove(customer);
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}