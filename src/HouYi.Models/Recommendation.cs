using System.ComponentModel.DataAnnotations;

namespace HouYi.Models;

public class Recommendation
{
    public int Id { get; set; }

    [StringLength(Constants.StringLengths.GUID)]
    public required string ResumeId { get; init; }
    public virtual Resume Resume { get; set; }
    public required int PositionId { get; init; }
    public virtual Position Position { get; set; }

    [StringLength(Constants.StringLengths.Text)]
    public required string Reason { get; init; }
    public RecommendationStatus Status { get; set; } = RecommendationStatus.Recommended;
    public RatingLevel MatchLevel { get; set; } = RatingLevel.NotRated;

    [StringLength(Constants.StringLengths.Text)]
    public string Feedback { get; set; } = string.Empty;
    public DateTime CreatedAt { get; init; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}