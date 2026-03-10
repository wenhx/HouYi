namespace HouYi.Models;

public class OperationLogQuery
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Module { get; set; }
    public string? Action { get; set; }
    public string? Keyword { get; set; }
    public bool? Result { get; set; }
}
