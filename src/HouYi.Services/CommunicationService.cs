using HouYi.Data;
using HouYi.Models;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Services;

public class CommunicationService : ICommunicationService
{
    private readonly HouYiDbContext _dbContext;

    public CommunicationService(HouYiDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<Communication>> GetCommunicationsCoreAsync(Func<IQueryable<Communication>, IQueryable<Communication>>? filter, int pageNumber = 1, int pageSize = 10, CommunicatedResult? result = null)
    {
        Utils.NormalizePaginationInputs(ref pageNumber, ref pageSize);

        var query = _dbContext.Communications
            .Include(c => c.Resume)
            .Include(c => c.Position)
                .ThenInclude(p => p.Customer)
            .AsQueryable();

        if (result.HasValue)
        {
            query = query.Where(c => c.Result == result.Value);
        }

        query = filter != null ? filter(query) : query;

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Communication>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<PagedResult<Communication>> GetCommunicationsAsync(int pageNumber = 1, int pageSize = 10, CommunicatedResult? result = null)
    {
        return await GetCommunicationsCoreAsync(filter: null, pageNumber, pageSize, result);
    }

    public async Task<PagedResult<Communication>> FindCommunicationsAsync(string term = "", int pageNumber = 1, int pageSize = 10, CommunicatedResult? result = null)
    {
        return await GetCommunicationsCoreAsync(filter, pageNumber, pageSize, result);

        IQueryable<Communication> filter(IQueryable<Communication> query)
        {
            if (!string.IsNullOrWhiteSpace(term))
            {
                term = term.Trim();
                query = query.Where(c => 
                    c.Resume.Name.Contains(term) || 
                    c.Resume.Position.Contains(term) ||
                    (c.Position != null && c.Position.Name.Contains(term)) ||
                    c.Content.Contains(term));
            }
            return query;
        }
    }
} 