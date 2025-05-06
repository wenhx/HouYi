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