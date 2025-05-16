using HouYi.Data;
using HouYi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Globalization;

namespace HouYi.Services;

public class StatisticsService : IStatisticsService
{
    private readonly HouYiDbContext _context;
    private readonly ILogger<StatisticsService> _logger;

    public StatisticsService(HouYiDbContext context, ILogger<StatisticsService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IReadOnlyCollection<Statistics>> GetStatisticsAsync(StatisticsQuery query)
    {
        var statistics = new List<Statistics>();
        var currentDate = query.StartDate;

        while (currentDate <= query.EndDate)
        {
            var endDate = GetEndDate(currentDate, query.GroupBy);
            if (endDate > query.EndDate)
            {
                endDate = query.EndDate;
            }

            var stat = await GetStatisticsForPeriodAsync(currentDate, endDate, query);
            statistics.Add(stat);

            currentDate = endDate.AddDays(1);
        }

        return statistics;
    }

    public async Task<StatisticsSummary> GetStatisticsSummaryAsync(StatisticsQuery query)
    {
        if (query == null)
            throw new ArgumentNullException(nameof(query));

        _logger.LogInformation("Getting statistics summary for query: {0}, {1}, {2}", query.StartDate, query.EndDate, query.ConsultantId);
        var statistics = await GetStatisticsAsync(query);
        StatisticsSummary summary = new()
        {
            TotalResumeCount = statistics.Sum(s => s.ResumeCount),
            TotalPositionCount = statistics.Sum(s => s.PositionCount),
            TotalCommunicationCount = statistics.Sum(s => s.CommunicationCount),
            TotalRecommendationCount = statistics.Sum(s => s.RecommendationCount),
            TotalRecommendationAcceptedCount = statistics.Sum(s => s.RecommendationAcceptedCount),
            TotalDealCount = statistics.Sum(s => s.DealCount),
            TotalInterviewCount = statistics.Sum(s => s.InterviewCount),
            TotalPassCount = statistics.Sum(s => s.PassCount),
            TotalFailCount = statistics.Sum(s => s.FailCount),
            TotalCancelCount = statistics.Sum(s => s.CancelCount)
        };
        summary.RecommendationAcceptRate = summary.TotalRecommendationCount > 0 ?
                Math.Round((decimal)summary.TotalRecommendationAcceptedCount / summary.TotalRecommendationCount * 100, 2) : 0;
        summary.InterviewPassRate = summary.TotalInterviewCount > 0 ?
                Math.Round((decimal)summary.TotalPassCount / summary.TotalInterviewCount * 100, 2) : 0;
        //summary.InterviewPassRate = statistics.Average(s => s.PassRate);
        return summary;
    }

    public async Task<byte[]> ExportToExcelAsync(StatisticsQuery query)
    {
        // TODO: 实现Excel导出
        throw new NotImplementedException();
    }

    public async Task<byte[]> ExportToPdfAsync(StatisticsQuery query)
    {
        // TODO: 实现PDF导出
        throw new NotImplementedException();
    }

    private async Task<Statistics> GetStatisticsForPeriodAsync(DateTime startDate, DateTime endDate, StatisticsQuery query)
    {
        var resumeQuery = _context.Resumes.AsQueryable();
        var positionQuery = _context.Positions.AsQueryable();
        var communicationQuery = _context.Communications.AsQueryable();
        var recommendationQuery = _context.Recommendations.AsQueryable();
        var interviewQuery = _context.Interviews.AsQueryable();

        // 应用时间范围过滤
        resumeQuery = resumeQuery.Where(r => r.CreatedAt >= startDate && r.CreatedAt <= endDate);
        positionQuery = positionQuery.Where(p => p.CreatedAt >= startDate && p.CreatedAt <= endDate);
        communicationQuery = communicationQuery.Where(c => c.CreatedAt >= startDate && c.CreatedAt <= endDate);
        recommendationQuery = recommendationQuery.Where(r => r.CreatedAt >= startDate && r.CreatedAt <= endDate);
        interviewQuery = interviewQuery.Where(i => i.InterviewTime >= startDate && i.InterviewTime <= endDate);
        IQueryable<Recommendation> dealQuery = _context.Recommendations.Where(r => r.HiringStatusChangedAt >= startDate && r.HiringStatusChangedAt <= endDate);

        // 应用顾问过滤
        if (query.ConsultantId != 0)
        {
            //TODO: 简历增加Creator属性记录创建人
            //resumeQuery = resumeQuery.Where(r => r.CreatorId == query.ConsultantId);
            positionQuery = positionQuery.Where(p => p.ConsultantId == query.ConsultantId);
            communicationQuery = communicationQuery.Where(c => c.Position.ConsultantId == query.ConsultantId);
            recommendationQuery = recommendationQuery.Where(r => r.Position.ConsultantId == query.ConsultantId);
            interviewQuery = interviewQuery.Where(i => i.Position.ConsultantId == query.ConsultantId);
            dealQuery = dealQuery.Where(r => r.Position.ConsultantId == query.ConsultantId);
        }

        int resumeCount = await resumeQuery.CountAsync();
        int positionCount = await positionQuery.CountAsync();
        int communicationCount = await communicationQuery.CountAsync();
        int recommendationCount = await recommendationQuery.CountAsync();
        int recommendationAcceptedCount = await recommendationQuery.CountAsync(r => r.Status == RecommendationStatus.Accepted);
        int dealCount = await dealQuery.CountAsync(r => r.HiringStatus > 0); //关于成单的定义可能需要调整。
        //decimal recommendationAcceptedRate = recommendationCount > 0 ? Math.Round((decimal)recommendationAcceptedCount / recommendationCount * 100, 2) : 0;

        //var interviewStatus = await interviewQuery.Select(i => new { Status = i.Status }).ToListAsync();
        //var interviewCount = interviewStatus.Count;
        //var passCount = interviewStatus.Count(i => i.Status == InterviewStatus.Passed);
        //var failCount = interviewStatus.Count(i => i.Status == InterviewStatus.Failed);
        //var cancelCount = interviewStatus.Count(i => i.Status == InterviewStatus.Cancelled);

        var result = await interviewQuery
                .GroupBy(i => 1) // 将所有记录分组以便聚合
                .Select(g => new
                {
                    InterviewCount = g.Count(),
                    PassCount = g.Count(i => i.Status == InterviewStatus.Passed),
                    FailCount = g.Count(i => i.Status == InterviewStatus.Failed),
                    CancelCount = g.Count(i => i.Status == InterviewStatus.Cancelled)
                })
                .FirstOrDefaultAsync();

        int interviewCount = result?.InterviewCount ?? 0;
        int passCount = result?.PassCount ?? 0;
        int failCount = result?.FailCount ?? 0;
        int cancelCount = result?.CancelCount ?? 0;
        decimal passRate = interviewCount > 0 ? Math.Round((decimal)passCount / interviewCount * 100, 2) : 0;

        return new Statistics
        {
            Date = startDate,
            ResumeCount = resumeCount,
            PositionCount = positionCount,
            CommunicationCount = communicationCount,
            RecommendationCount = recommendationCount,
            RecommendationAcceptedCount = recommendationAcceptedCount,
            DealCount = dealCount,
            InterviewCount = interviewCount,
            PassCount = passCount,
            FailCount = failCount,
            CancelCount = cancelCount,
            PassRate = passRate
        };
    }

    private DateTime GetEndDate(DateTime startDate, string groupBy)
    {
        return groupBy switch
        {
            "day" => startDate.AddDays(1).AddSeconds(-1),
            "week" => startDate.AddDays(7).AddSeconds(-1),
            "month" => startDate.AddMonths(1).AddSeconds(-1),
            _ => startDate.AddMonths(1).AddSeconds(-1)
        };
    }
}