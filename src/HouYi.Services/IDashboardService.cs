using HouYi.Models;

namespace HouYi.Services;

public interface IDashboardService
{
    Task<DashboardStats> GetDashboardStatsAsync(DateTime startOfMonth, DateTime endOfMonth);
    Task<DashboardRecentActivity> GetRecentActivitiesAsync(int count = 5);
}