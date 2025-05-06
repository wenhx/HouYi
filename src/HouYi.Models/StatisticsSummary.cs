namespace HouYi.Models;

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
