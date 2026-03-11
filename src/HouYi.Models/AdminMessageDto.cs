namespace HouYi.Models;

public class AdminMessageDto
{
    public int Id { get; set; }

    public string ReceiverName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public MessageType ContentType { get; set; }

    public string SenderName { get; set; } = string.Empty;

    public DateTime SentAt { get; set; }

    public MessageReadStatus ReadStatus { get; set; }
}
