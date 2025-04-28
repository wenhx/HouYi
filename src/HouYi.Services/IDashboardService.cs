using HouYi.Models;

namespace HouYi.Services;

public interface IDashboardService
{
    Task<DashboardStats> GetDashboardStatsAsync(DateTime startOfMonth, DateTime endOfMonth);
}