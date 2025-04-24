using HouYi.Data;
using HouYi.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

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
                .Select(p => new Position
                {
                    Id = p.Id,
                    Name = p.Name,
                    CustomerId = p.CustomerId,
                    Customer = p.Customer,
                    Status = p.Status,
                    Number = p.Number,
                    ConsultantId = p.ConsultantId,
                    Consultant = p.Consultant,
                    ContactPerson = p.ContactPerson,
                    ContactPhone = p.ContactPhone,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    RecommendationsCount = _dbContext.Recommendations.Count(r => r.PositionId == p.Id)
                });

        if (status.HasValue)
        {
            query = query.Where(p => p.Status == status.Value);
        }

        query = filter != null ? filter(query) : query;

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(p => p.Status == PositionStatus.Open)
            .ThenByDescending(p => p.UpdatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Position>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<PagedResult<Position>> GetPositionsAsync(int pageNumber = 1, int pageSize = 10, PositionStatus? status = null)
    {
        return await GetPositionsCoreAsync(filter: null, pageNumber, pageSize, status);
    }

    public async Task<PagedResult<Position>> FindPositionsAsync(string term = "", int pageNumber = 1, int pageSize = 10, PositionStatus? status = null)
    {
        return await GetPositionsCoreAsync(filter, pageNumber, pageSize, status);

        IQueryable<Position> filter(IQueryable<Position> query)
        {
            if (!string.IsNullOrWhiteSpace(term))
            {
                term = term.Trim();
                query = query.Where(p =>
                    p.Name.Contains(term) ||
                    p.Customer.Name.Contains(term) ||
                    p.Consultant.UserName.Contains(term) ||
                    p.ContactPerson.Contains(term) ||
                    p.ContactPhone.Contains(term)
                );
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

    public async Task UpdatePositionAsync(Position position)
    {
        var existingPosition = await _dbContext.Positions.FindAsync(position.Id);
        if (existingPosition != null)
        {
            existingPosition.Name = position.Name;
            existingPosition.CustomerId = position.CustomerId;
            existingPosition.Status = position.Status;
            existingPosition.Number = position.Number;
            existingPosition.Description = position.Description;
            existingPosition.ConsultantId = position.ConsultantId;
            existingPosition.ContactPerson = position.ContactPerson;
            existingPosition.ContactPhone = position.ContactPhone;
            existingPosition.UpdatedAt = DateTime.Now;
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task DeletePositionAsync(int id)
    {
        var position = await _dbContext.Positions
            .FirstOrDefaultAsync(p => p.Id == id);

        if (position != null)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                int recommendationCount = await _dbContext.Recommendations
                                                    .CountAsync(r => r.PositionId == id);
                if (recommendationCount > 0)
                    throw new InvalidOperationException($"无法删除职位，因为该职位还有 {recommendationCount} 条推荐记录。请先处理这些推荐记录后再删除职位。");

                _dbContext.Communications.Where(c => c.PositionId == id)
                            .ExecuteUpdate(c => c.SetProperty(c => c.PositionId, c => null));

                _dbContext.Positions.Remove(position);
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }

    public async Task<Position> CreatePositionAsync(Position position)
    {
        if (position == null)
            throw new ArgumentNullException(nameof(position), "position不能为空");

        var validationContext = new ValidationContext(position);
        var validationResults = new List<ValidationResult>();
        if (!Validator.TryValidateObject(position, validationContext, validationResults, true))
        {
            var errorMessages = validationResults.Select(r => r.ErrorMessage);
            throw new ArgumentException(string.Join(Environment.NewLine, errorMessages));
        }

        position.CreatedAt = DateTime.Now;
        position.UpdatedAt = DateTime.Now;
        position.Customer = null;
        position.Consultant = null;

        _dbContext.Positions.Add(position);
        await _dbContext.SaveChangesAsync();

        return position;
    }
}