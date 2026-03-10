using System.ComponentModel.DataAnnotations;

namespace HouYi.Models;

public class OperationLog
{
    public int Id { get; set; }

    [StringLength(Constants.StringLengths.ShorterText)]
    public required string Module { get; set; }

    [StringLength(Constants.StringLengths.ShorterText)]
    public required string Action { get; set; }

    [StringLength(Constants.StringLengths.ShorterText)]
    public required string EntityType { get; set; }

    [StringLength(Constants.StringLengths.ShorterText)]
    public string EntityId { get; set; } = string.Empty;

    public bool Result { get; set; }

    [StringLength(Constants.StringLengths.Text)]
    public string Message { get; set; } = string.Empty;

    [StringLength(Constants.StringLengths.LongerText)]
    public string? BeforeData { get; set; }

    [StringLength(Constants.StringLengths.LongerText)]
    public string? AfterData { get; set; }

    [StringLength(Constants.StringLengths.LongerText)]
    public string? ExtraData { get; set; }

    public int UserId { get; set; }

    [StringLength(Constants.StringLengths.ShorterText)]
    public string? UserName { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
