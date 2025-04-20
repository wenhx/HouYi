using HouYi.Data;
using HouYi.Models;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Services;

public class InterviewService : IInterviewService
{
    private readonly HouYiDbContext _dbContext;

    public InterviewService(HouYiDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Interview>> GetTodayInterviewsAsync()
    {
        var today = DateTime.Today;
        var tomorrow = today.AddDays(1);

        return await _dbContext.Interviews
            .Include(i => i.Resume)
            .Include(i => i.Position)
                .ThenInclude(p => p.Customer)
            .Where(i => i.InterviewTime >= today && i.InterviewTime < tomorrow)
            .OrderBy(i => i.InterviewTime)
            .ToListAsync();
    }

    public async Task<PagedResult<Interview>> GetInterviewsAsync(int pageNumber, int pageSize)
    {
        var query = _dbContext.Interviews
            .Include(i => i.Resume)
            .Include(i => i.Position)
                .ThenInclude(p => p.Customer)
            .OrderByDescending(i => i.InterviewTime);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Interview>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<PagedResult<Interview>> FindInterviewsAsync(string term, int pageNumber, int pageSize)
    {
        var query = _dbContext.Interviews
            .Include(i => i.Resume)
            .Include(i => i.Position)
                .ThenInclude(p => p.Customer)
            .Where(i =>
                i.Resume.Name.Contains(term) ||
                i.Position.Name.Contains(term) ||
                i.Position.Customer.Name.Contains(term) ||
                i.Location.Contains(term) ||
                i.Interviewer.Contains(term))
            .OrderByDescending(i => i.InterviewTime);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Interview>(items, pageNumber, pageSize, totalCount);
    }
}