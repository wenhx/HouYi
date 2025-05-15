namespace HouYi.Models;

public class EditingRecommendation
{
    public int Id { get; set; }
    public RecommendationStatus Status { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Feedback { get; set; } = string.Empty;
}
