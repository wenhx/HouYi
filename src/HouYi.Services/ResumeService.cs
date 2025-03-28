using HouYi.Data;
using HouYi.Infrastructure;
using HouYi.Models;
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
        if (pageIndex < 0 && pageIndex > Constants.Integers.MaximumPageIndex)
            throw new ArgumentOutOfRangeException(nameof(pageIndex), 
                $"页码必须在 0 到 {Constants.Integers.MaximumPageIndex} 之间。");
        if (pageSize < 10 && pageSize > Constants.Integers.MaximumPageSize)
            throw new ArgumentOutOfRangeException(nameof(pageSize),
                $"每页显示的记录数必须在 10 到 {Constants.Integers.MaximumPageSize} 之间。");

        var query = _context.Resumes.AsNoTracking();
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(r => r.UpdatedAt)
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Resume> { Items = items, TotalCount = totalCount };
    }

    public async Task<InvokedResult> UpdateResumePropertyAsync<T>(string id, string propertyName, T value)
    {
        if (string.IsNullOrEmpty(id))
            throw new ArgumentException("id不能为空", nameof(id));
        if (string.IsNullOrEmpty(propertyName))
            throw new ArgumentException("属性名不能为空", nameof(propertyName));

        var resume = await _context.Resumes.FindAsync(id);
        if (resume == null)
            return InvokedResult.Failure("简历不存在");

        var property = typeof(Resume).GetProperty(propertyName);
        if (property == null)
            return InvokedResult.Failure($"属性 {propertyName} 不存在");

        var validationResult = ValidationHelper.ValidateProperty<Resume, T>(property, value);
        if (!validationResult.IsValid)
            return InvokedResult.Failure(validationResult.ErrorMessage ?? "提交的数据有误。");

        property.SetValue(resume, value);
        resume.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        return InvokedResult.Success;
    }

    public async Task<bool> DeleteResumeAsync(string id)
    {
        if (string.IsNullOrEmpty(id))
            throw new ArgumentException("id不能为空", nameof(id));

        var resume = await _context.Resumes.FindAsync(id);
        if (resume == null) return false;

        _context.Resumes.Remove(resume);
        await _context.SaveChangesAsync();
        return true;
    }
}