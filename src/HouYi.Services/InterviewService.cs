using HouYi.Data;
using HouYi.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

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
            .Include(i => i.Recommendation)
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
            .Include(i => i.Recommendation)
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

    public async Task<Interview> CreateInterviewAsync(Interview interview)
    {
        if (interview == null)
            throw new ArgumentNullException(nameof(interview), "interview不能为空");

        var validationContext = new ValidationContext(interview);
        var validationResults = new List<ValidationResult>();
        if (!Validator.TryValidateObject(interview, validationContext, validationResults, true))
        {
            var errorMessages = validationResults.Select(r => r.ErrorMessage);
            throw new ArgumentException(string.Join(Environment.NewLine, errorMessages));
        }

        // 同时检查简历、职位和推荐记录是否存在
        var result = await (
            from r in _dbContext.Resumes
            join p in _dbContext.Positions on 1 equals 1
            join rec in _dbContext.Recommendations on 1 equals 1
            where r.Id == interview.ResumeId
                && p.Id == interview.PositionId
                && rec.Id == interview.RecommendationId
            select new { Resume = r, Position = p, Recommendation = rec })
            .FirstOrDefaultAsync();

        if (result?.Resume == null)
            throw new ArgumentException($"简历ID {interview.ResumeId} 不存在", nameof(interview.ResumeId));
        if (result?.Position == null)
            throw new ArgumentException($"职位ID {interview.PositionId} 不存在", nameof(interview.PositionId));
        if (result?.Recommendation == null)
            throw new ArgumentException($"推荐ID {interview.RecommendationId} 不存在", nameof(interview.RecommendationId));

        // 检查同一简历在同一时间是否已有面试安排
        var hasConflict = await _dbContext.Interviews
            .AnyAsync(i => i.ResumeId == interview.ResumeId &&
                          i.InterviewTime.Date == interview.InterviewTime.Date &&
                          i.Status == InterviewStatus.Scheduled);
        if (hasConflict)
            throw new InvalidOperationException("该候选人当天已有其他面试安排");

        Interview newInstance = new()
        {
            ResumeId = interview.ResumeId,
            PositionId = interview.PositionId,
            RecommendationId = interview.RecommendationId,
            InterviewTime = interview.InterviewTime,
            Round = interview.Round,
            Location = interview.Location,
            Interviewer = interview.Interviewer,
            Remarks = interview.Remarks
        };
        _dbContext.Interviews.Add(newInstance);
        await _dbContext.SaveChangesAsync();
        return interview;
    }

    public async Task<Interview> GetInterviewByIdAsync(int id)
    {
        var interview = await _dbContext.Interviews
            .Include(i => i.Resume)
            .Include(i => i.Position)
                .ThenInclude(p => p.Customer)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (interview == null)
            throw new ArgumentException($"面试ID {id} 不存在", nameof(id));

        return interview;
    }

    public async Task DeleteInterviewAsync(int id)
    {
        var interview = await _dbContext.Interviews.FindAsync(id);
        if (interview == null)
            throw new ArgumentException($"面试ID {id} 不存在", nameof(id));

        _dbContext.Interviews.Remove(interview);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Interview> UpdateInterviewAsync(Interview interview)
    {
        if (interview == null)
            throw new ArgumentNullException(nameof(interview), "interview不能为空");

        var validationContext = new ValidationContext(interview);
        var validationResults = new List<ValidationResult>();
        if (!Validator.TryValidateObject(interview, validationContext, validationResults, true))
        {
            var errorMessages = validationResults.Select(r => r.ErrorMessage);
            throw new ArgumentException(string.Join(Environment.NewLine, errorMessages));
        }

        var existingInterview = await _dbContext.Interviews
            .Include(i => i.Resume)
            .Include(i => i.Recommendation)
            .FirstOrDefaultAsync(i => i.Id == interview.Id);

        if (existingInterview == null)
            throw new ArgumentException($"面试ID {interview.Id} 不存在", nameof(interview.Id));

        // 检查同一简历在同一时间是否已有其他面试安排
        if (existingInterview.InterviewTime.Date != interview.InterviewTime.Date)
        {
            var hasConflict = await _dbContext.Interviews
                .AnyAsync(i => i.Id != interview.Id &&
                              i.ResumeId == interview.ResumeId &&
                              i.InterviewTime.Date == interview.InterviewTime.Date &&
                              i.Status == InterviewStatus.Scheduled);
            if (hasConflict)
                throw new InvalidOperationException("该候选人当天已有其他面试安排");
        }

        // 更新可修改的字段
        existingInterview.InterviewTime = interview.InterviewTime;
        existingInterview.Round = interview.Round;
        existingInterview.Location = interview.Location;
        existingInterview.Interviewer = interview.Interviewer;
        existingInterview.Feedback = interview.Feedback;
        existingInterview.Status = interview.Status;
        existingInterview.Remarks = interview.Remarks;
        if (interview?.Recommendation.HiringStatus == HiringStatus.Hired)
        {
            existingInterview.Recommendation.Status = interview.Recommendation.Status;
            existingInterview.Recommendation.HiringStatusChangedAt = DateTime.Now;
        }

        await _dbContext.SaveChangesAsync();
        return existingInterview;
    }
}