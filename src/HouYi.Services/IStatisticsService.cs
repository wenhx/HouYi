using HouYi.Models;

namespace HouYi.Services;

public interface IStatisticsService
{
    Task<IReadOnlyCollection<Statistics>> GetStatisticsAsync(StatisticsQuery query);
    Task<StatisticsSummary> GetStatisticsSummaryAsync(StatisticsQuery query);
    Task<byte[]> ExportToExcelAsync(StatisticsQuery query);
    Task<byte[]> ExportToPdfAsync(StatisticsQuery query);
}