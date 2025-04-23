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

    public async Task<Communication> UpdateCommunicationAsync(Communication communication)
    {
        communication.UpdatedAt = DateTime.Now;
        _dbContext.Communications.Update(communication);
        await _dbContext.SaveChangesAsync();
        return communication;
    }

    public async Task<Communication> CreateCommunicationAsync(Communication communication)
    {
        communication.CreatedAt = DateTime.Now;
        communication.UpdatedAt = DateTime.Now;

        _dbContext.Communications.Add(communication);
        await _dbContext.SaveChangesAsync();

        return communication;
    }

    public async Task<PagedResult<Communication>> GetCommunicationsCoreAsync(
        Func<IQueryable<Communication>, IQueryable<Communication>>? filter,
        int pageNumber = 1,
        int pageSize = 10,
        CommunicatedResult? result = null,
        CommunicationMethod? method = null,
        ContactReason? reason = null)
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

        if (method.HasValue)
        {
            query = query.Where(c => c.Method == method.Value);
        }

        if (reason.HasValue)
        {
            query = query.Where(c => c.Reason == reason.Value);
        }

        query = filter != null ? filter(query) : query;

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(q => q.UpdatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Communication>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<PagedResult<Communication>> GetCommunicationsAsync(
        int pageNumber = 1,
        int pageSize = 10,
        CommunicatedResult? result = null,
        CommunicationMethod? method = null,
        ContactReason? reason = null)
    {
        return await GetCommunicationsCoreAsync(filter: null, pageNumber, pageSize, result, method, reason);
    }

    public async Task<PagedResult<Communication>> FindCommunicationsAsync(
        string term = "",
        int pageNumber = 1,
        int pageSize = 10,
        CommunicatedResult? result = null,
        CommunicationMethod? method = null,
        ContactReason? reason = null)
    {
        return await GetCommunicationsCoreAsync(filter, pageNumber, pageSize, result, method, reason);

        IQueryable<Communication> filter(IQueryable<Communication> query)
        {
            if (!string.IsNullOrWhiteSpace(term))
            {
                term = term.Trim();
                query = query.Where(c =>
                    c.Resume.Name.Contains(term) ||
                    c.Resume.Position.Contains(term) ||
                    (c.Position != null && (
                        c.Position.Name.Contains(term) ||
                        c.Position.Customer.Name.Contains(term)
                    )) ||
                    c.Content.Contains(term));
            }
            return query;
        }
    }

    public async Task DeleteCommunicationAsync(int id)
    {
        var communication = await _dbContext.Communications.FindAsync(id);
        if (communication != null)
        {
            _dbContext.Communications.Remove(communication);
            await _dbContext.SaveChangesAsync();
        }
    }
}