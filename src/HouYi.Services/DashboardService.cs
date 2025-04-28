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
}