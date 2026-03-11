namespace HouYi.Models;

public class MessageQuery
{
    public MessageType? Type { get; set; }

    public MessageReadStatus? ReadStatus { get; set; }

    public string Keyword { get; set; } = string.Empty;

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}
