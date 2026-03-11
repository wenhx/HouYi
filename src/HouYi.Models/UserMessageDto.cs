namespace HouYi.Models;

public class UserMessageDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public MessageType ContentType { get; set; }

    public string SenderName { get; set; } = string.Empty;

    public DateTime SentAt { get; set; }

    public MessageReadStatus ReadStatus { get; set; }

    public DateTime? ReadAt { get; set; }
}
