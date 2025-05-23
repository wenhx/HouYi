﻿using System.ComponentModel.DataAnnotations;

namespace HouYi.Models;

public class Communication
{
    public int Id { get; set; }

    [StringLength(Constants.StringLengths.GUID)]
    public required string ResumeId { get; set; }
    public virtual Resume? Resume { get; set; }

    public int? PositionId { get; set; }
    public virtual Position? Position { get; set; }

    public required CommunicationMethod Method { get; set; }
    public required ContactReason Reason { get; set; }

    [StringLength(Constants.StringLengths.Text)]
    public required string Content { get; set; }
    public CommunicatedResult Result { get; set; }

    public DateTime CommunicationTime { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public static Communication Default()
    {
        return new Communication
        {
            ResumeId = Guid.Empty.ToString(),
            Method = CommunicationMethod.Other,
            Reason = ContactReason.Other,
            Content = string.Empty,
            Result = CommunicatedResult.NoResponse,
            CommunicationTime = DateTime.Now
        };
    }
}