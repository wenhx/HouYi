using HouYi.Data;
using HouYi.Models.Resumes;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Services;

public class ResumeService : IResumeService
{
    private readonly HouYiDbContext _context;

    public ResumeService(HouYiDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<Resume>> GetResumesAsync(int pageIndex, int pageSize)
    {
        var query = _context.Resumes.AsNoTracking();
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(r => r.UpdatedAt)
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Resume> { Items = items, TotalCount = totalCount };
    }

    public async Task<bool> UpdateResumePropertyAsync<T>(string id, string propertyName, T value)
    {
        var resume = await _context.Resumes.FindAsync(id);
        if (resume == null) return false;

        var property = typeof(Resume).GetProperty(propertyName);
        if (property == null) return false;

        property.SetValue(resume, value);
        resume.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteResumeAsync(string id)
    {
        var resume = await _context.Resumes.FindAsync(id);
        if (resume == null) return false;

        _context.Resumes.Remove(resume);
        await _context.SaveChangesAsync();
        return true;
    }
}
