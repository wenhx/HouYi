using System.ComponentModel.DataAnnotations;

namespace HouYi.Models;

public class Position
{
    public int Id { get; init; }
    [StringLength(Constants.StringLengths.Name)]
    public required string Name { get; init; }
    public required int CustomerId { get; init; }
    public required Customer Customer { get; init; }
    public PositionStatus Status { get; set; } = PositionStatus.Closed;
    public byte Number { get; set; } = 1;
    public required int ConsultantId { get; init; }
    public required HouYiUser Consultant { get; init; }
    [StringLength(Constants.StringLengths.Text)]
    public required string Description { get; init; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
