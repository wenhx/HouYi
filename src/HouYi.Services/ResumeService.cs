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
} 