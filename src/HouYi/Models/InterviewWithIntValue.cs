using System.Diagnostics.CodeAnalysis;

namespace HouYi.Models;

public class InterviewWithIntValue : Interview
{
    public int IntRound
    {
        get => Round;
        set => Round = (byte)value;
    }

    [SetsRequiredMembers]
    public InterviewWithIntValue(Interview interview)
    {
        if (interview == null)
            throw new ArgumentNullException(nameof(interview));

        Id = interview.Id;
        ResumeId = interview.ResumeId;
        Resume = interview.Resume;
        PositionId = interview.PositionId;
        Position = interview.Position;
        RecommendationId = interview.RecommendationId;
        InterviewTime = interview.InterviewTime;
        Round = interview.Round;
        Location = interview.Location;
        Interviewer = interview.Interviewer;
        Status = interview.Status;
        Feedback = interview.Feedback;
        CreatedAt = interview.CreatedAt;
        UpdatedAt = interview.UpdatedAt;
    }
}