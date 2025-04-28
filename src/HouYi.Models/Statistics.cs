namespace HouYi.Models;

public class Statistics
{
    public DateTime Date { get; set; }
    public int ResumeCount { get; set; }
    public int PositionCount { get; set; }
    public int CommunicationCount { get; set; }
    public int RecommendationCount { get; set; }
    public int RecommendationAcceptedCount { get; set; }
    public int DealCount { get; set; }
    public int InterviewCount { get; set; }
    public int PassCount { get; set; }
    public int FailCount { get; set; }
    public int CancelCount { get; set; }
    public decimal PassRate { get; set; }
}

public class StatisticsSummary
{
    public int TotalResumeCount { get; set; }
    public int TotalPositionCount { get; set; }
    public int TotalCommunicationCount { get; set; }
    public int TotalRecommendationCount { get; set; }
    public int TotalRecommendationAcceptedCount { get; set; }
    public int TotalDealCount { get; set; }
    public int TotalInterviewCount { get; set; }
    public int TotalPassCount { get; set; }
    public int TotalFailCount { get; set; }
    public int TotalCancelCount { get; set; }
    public decimal InterviewPassRate { get; set; }
    public decimal RecommendationAcceptRate { get; set; }
}

public class StatisticsQuery
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string GroupBy { get; set; } = "month";
    public int ConsultantId { get; set; }
} 