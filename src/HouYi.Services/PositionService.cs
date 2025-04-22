using HouYi.Data;
using HouYi.Models;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Services;

public class PositionService : IPositionService
{
    private readonly HouYiDbContext _dbContext;

    public PositionService(HouYiDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<Position>> GetPositionsCoreAsync(Func<IQueryable<Position>, IQueryable<Position>>? filter, int pageNumber = 1, int pageSize = 10, PositionStatus? status = null)
    {
        Utils.NormalizePaginationInputs(ref pageNumber, ref pageSize);

        var query = _dbContext.Positions
            .Include(p => p.Customer)
            .Include(p => p.Consultant)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(p => p.Status == status.Value);
        }

        query = filter != null ? filter(query) : query;

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Position>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<PagedResult<Position>> GetPositionsAsync(int pageNumber = 1, int pageSize = 10, PositionStatus? status = null)
    {
        return await GetPositionsCoreAsync(filter: null, pageNumber, pageSize, status);
    }

    public async Task<PagedResult<Position>> FindPositionsAsync(string field = "", string term = "", int pageNumber = 1, int pageSize = 10, PositionStatus? status = null)
    {
        return await GetPositionsCoreAsync(filter, pageNumber, pageSize, status);

        IQueryable<Position> filter(IQueryable<Position> query)
        {
            if (!string.IsNullOrWhiteSpace(term))
            {
                term = term.Trim();

                switch (field)
                {
                    case "Name":
                        query = query.Where(p => p.Name.Contains(term));
                        break;
                    case "Customer":
                        query = query.Where(p => p.Customer.Name.Contains(term));
                        break;
                    case "Consultant":
                        query = query.Where(p => p.Consultant.UserName.Contains(term));
                        break;
                    default:
                        break;
                }
            }
            return query;
        }
    }

    public async Task<Position?> GetPositionByIdAsync(int id)
    {
        return await _dbContext.Positions
            .Include(p => p.Customer)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
}