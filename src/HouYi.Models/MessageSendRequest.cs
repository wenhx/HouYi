using System.ComponentModel.DataAnnotations;

namespace HouYi.Models;

public class MessageSendRequest
{
    [Required]
    [StringLength(Constants.StringLengths.ShorterText)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(Constants.StringLengths.Text)]
    public string Content { get; set; } = string.Empty;

    public MessageType Type { get; set; } = MessageType.System;
}
