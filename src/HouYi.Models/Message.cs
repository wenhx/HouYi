namespace HouYi.Models;

public class Message
{
    public int Id { get; set; }

    public int ReceiverId { get; set; }

    public HouYiUser? Receiver { get; set; }

    public int SenderId { get; set; }

    public HouYiUser? Sender { get; set; }

    public int ContentId { get; set; }

    public MessageContent? Content { get; set; }

    public MessageSendStatus SendStatus { get; set; } = MessageSendStatus.Pending;

    public MessageReadStatus ReadStatus { get; set; } = MessageReadStatus.Unread;

    public DateTime SentAt { get; set; } = DateTime.Now;

    public DateTime? ReadAt { get; set; }
}
