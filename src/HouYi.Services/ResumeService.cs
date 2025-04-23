using HouYi.Data;
using HouYi.Models;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Services;

public class ResumeService : IResumeService
{
    private readonly HouYiDbContext _dbContext;

    public ResumeService(HouYiDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<Resume>> GetResumesCoreAsync(Func<IQueryable<Resume>, IQueryable<Resume>>? filter, int pageNumber = 1, int pageSize = 10, Gender? gender = null, EmploymentStatus? status = null)
    {
        Utils.NormalizePaginationInputs(ref pageNumber, ref pageSize);

        var query = _dbContext.Resumes.Include(r => r.Place).AsQueryable();

        if (gender.HasValue)
        {
            query = query.Where(r => r.Gender == gender.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(r => r.Status == status.Value);
        }

        query = filter != null ? filter(query) : query;

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .OrderByDescending(r => r.UpdatedAt)
            .ToListAsync();

        return new PagedResult<Resume>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<PagedResult<Resume>> GetResumesAsync(int pageNumber = 1, int pageSize = 10, Gender? gender = null, EmploymentStatus? status = null)
    {
        return await GetResumesCoreAsync(filter: null, pageNumber, pageSize, gender, status);
    }

    public async Task<PagedResult<Resume>> FindResumesAsync(string field = "", string term = "", int pageNumber = 1, int pageSize = 10, Gender? gender = null, EmploymentStatus? status = null)
    {
        return await GetResumesCoreAsync(filter, pageNumber, pageSize, gender, status);

        IQueryable<Resume> filter(IQueryable<Resume> query)
        {
            if (!string.IsNullOrWhiteSpace(term))
            {
                term = term.Trim();

                switch (field)
                {
                    case "Name":
                        query = query.Where(r => r.Name.Contains(term));
                        break;
                    case "Phone":
                        query = query.Where(r => r.Phone.Contains(term));
                        break;
                    case "Email":
                        query = query.Where(r => r.Email.Contains(term));
                        break;
                    case "Position":
                        query = query.Where(r => r.Position.Contains(term));
                        break;
                    default:
                        break;
                }
            }
            return query;
        }
    }

    public async Task<Resume> UpdateResumeAsync(Resume editingResume)
    {
        var resume = await _dbContext.Resumes.FindAsync(editingResume.Id);
        if (resume == null)
            throw new InvalidOperationException($"找不到ID为 {editingResume.Id} 的简历");

        // 更新所有属性
        resume.Name = editingResume.Name;
        resume.Gender = editingResume.Gender;
        resume.Age = editingResume.Age;
        resume.Phone = editingResume.Phone;
        resume.Email = editingResume.Email;
        resume.Status = editingResume.Status;
        resume.Position = editingResume.Position;
        resume.HighestEducation = editingResume.HighestEducation;
        resume.AnnualSalary = editingResume.AnnualSalary;
        resume.YearsOfExperience = editingResume.YearsOfExperience;
        resume.PlaceId = editingResume.PlaceId;
        resume.Source = editingResume.Source;
        resume.Note = editingResume.Note;
        resume.UpdatedAt = DateTime.Now;

        await _dbContext.SaveChangesAsync();
        return resume;
    }

    public async Task DeleteResumeAsync(string resumeId)
    {
        var resume = await _dbContext.Resumes.FindAsync(resumeId);
        if (resume == null)
            throw new InvalidOperationException($"找不到ID为 {resumeId} 的简历");

        _dbContext.Resumes.Remove(resume);
        await _dbContext.SaveChangesAsync();
    }
}