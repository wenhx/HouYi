namespace HouYi.Models;

public class DashboardRecentActivity
{
    public List<RecentInterview> RecentInterviews { get; set; } = new();
    public List<RecentRecommendation> RecentRecommendations { get; set; } = new();
    public List<RecentCommunication> RecentCommunications { get; set; } = new();
    public List<RecentResume> RecentResumes { get; set; } = new();
}

public class RecentInterview
{
    public string CandidateName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public DateTime InterviewTime { get; set; }
    public string Location { get; set; } = string.Empty;
    public InterviewStatus Status { get; set; }
}

public class RecentRecommendation
{
    public string CandidateName { get; set; } = string.Empty;
    public DateTime RecommendationTime { get; set; }
    public RecommendationStatus Status { get; set; }
}

public class RecentCommunication
{
    public string CandidateName { get; set; } = string.Empty;
    public DateTime CommunicationTime { get; set; }
    public CommunicatedResult Result { get; set; }
}

public class RecentResume
{
    public string CandidateName { get; set; } = string.Empty;
    public DateTime SubmitTime { get; set; }
    public EmploymentStatus Status { get; set; }
}