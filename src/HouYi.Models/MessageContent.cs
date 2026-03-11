using System.ComponentModel.DataAnnotations;

namespace HouYi.Models;

public class MessageContent
{
    public int Id { get; set; }

    [StringLength(Constants.StringLengths.ShorterText)]
    public string Title { get; set; } = string.Empty;

    public MessageType ContentType { get; set; } = MessageType.System;

    [StringLength(Constants.StringLengths.Text)]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
