namespace HouYi.Models;

public class StatisticsQuery
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string GroupBy { get; set; } = "month";
    public int ConsultantId { get; set; }
}