namespace HouYi.Models;

public class MessageSendResult
{
    public int Total { get; set; }

    public int Success { get; set; }

    public int Failed { get; set; }

    public string? Message { get; set; }
}
