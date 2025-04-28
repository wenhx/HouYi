using HouYi.Data;
using HouYi.Models;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Services;

public class DashboardService : IDashboardService
{
    private readonly HouYiDbContext _context;

    public DashboardService(HouYiDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStats> GetDashboardStatsAsync(DateTime startOfMonth, DateTime endOfMonth)
    {
        if (startOfMonth >= endOfMonth)
            throw new ArgumentException("Start date must be less than end date.");

        return new DashboardStats
        {
            TotalResumes = await _context.Resumes
                .CountAsync(r => r.CreatedAt >= startOfMonth && r.CreatedAt <= endOfMonth),

            TotalCommunications = await _context.Communications
                .CountAsync(c => c.CreatedAt >= startOfMonth && c.CreatedAt <= endOfMonth),

            TotalRecommendations = await _context.Recommendations
                .CountAsync(r => r.CreatedAt >= startOfMonth && r.CreatedAt <= endOfMonth),

            TotalInterviews = await _context.Interviews
                .CountAsync(i => i.CreatedAt >= startOfMonth && i.CreatedAt <= endOfMonth),

            TotalSuccessDeals = await _context.Positions
                .CountAsync(p => p.Status == PositionStatus.Completed && p.UpdatedAt >= startOfMonth && p.UpdatedAt <= endOfMonth)
        };
    }

    public async Task<DashboardRecentActivity> GetRecentActivitiesAsync(int count = 5)
    {
        var now = DateTime.Now;
        var startOfDay = now.Date;
        var endOfDay = startOfDay.AddDays(1);

        var recentInterviews = await _context.Interviews
            .Include(i => i.Resume)
            .Include(i => i.Position)
            .Where(i => i.InterviewTime >= startOfDay && i.InterviewTime <= endOfDay)
            .OrderBy(i => i.InterviewTime)
            .Take(count)
            .Select(i => new RecentInterview
            {
                CandidateName = i.Resume.Name,
                Position = i.Position.Name,
                InterviewTime = i.InterviewTime,
                Location = i.Location,
                Status = i.Status
            })
            .ToListAsync();

        var recentRecommendations = await _context.Recommendations
            .Include(r => r.Resume)
            .OrderByDescending(r => r.CreatedAt)
            .Take(count)
            .Select(r => new RecentRecommendation
            {
                CandidateName = r.Resume.Name,
                RecommendationTime = r.CreatedAt,
                Status = r.Status
            })
            .ToListAsync();

        var recentCommunications = await _context.Communications
            .Include(c => c.Resume)
            .OrderByDescending(c => c.CreatedAt)
            .Take(count)
            .Select(c => new RecentCommunication
            {
                CandidateName = c.Resume.Name,
                CommunicationTime = c.CreatedAt,
                Result = c.Result
            })
            .ToListAsync();

        var recentResumes = await _context.Resumes
            .OrderByDescending(r => r.CreatedAt)
            .Take(count)
            .Select(r => new RecentResume
            {
                CandidateName = r.Name,
                SubmitTime = r.CreatedAt,
                Status = r.Status
            })
            .ToListAsync();

        return new DashboardRecentActivity
        {
            RecentInterviews = recentInterviews,
            RecentRecommendations = recentRecommendations,
            RecentCommunications = recentCommunications,
            RecentResumes = recentResumes
        };
    }
}