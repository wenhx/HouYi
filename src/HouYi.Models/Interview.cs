using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HouYi.Models;

public class Interview
{
    public int Id { get; set; }

    [StringLength(Constants.StringLengths.GUID)]
    public required string ResumeId { get; set; }
    public virtual Resume Resume { get; set; }

    public required int PositionId { get; set; }
    public Position Position { get; set; }

    public required int RecommendationId { get; set; }

    public required DateTime InterviewTime { get; set; }

    [StringLength(Constants.StringLengths.Address)]
    public required string Location { get; set; }

    public byte Round { get; set; }

    [StringLength(Constants.StringLengths.Name)]
    public required string Interviewer { get; set; }

    public InterviewStatus Status { get; set; }

    [StringLength(Constants.StringLengths.Text)]
    public string Feedback { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}