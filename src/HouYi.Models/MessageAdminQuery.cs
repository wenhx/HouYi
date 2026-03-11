namespace HouYi.Models;

public class MessageAdminQuery
{
    public MessageType? Type { get; set; }

    public MessageReadStatus? ReadStatus { get; set; }

    public string Keyword { get; set; } = string.Empty;

    public string ReceiverKeyword { get; set; } = string.Empty;

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}
