using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HouYi.Models;

public class Position
{
    public int Id { get; init; }

    [StringLength(Constants.StringLengths.Name)]
    public required string Name { get; set; }
    public required int CustomerId { get; set; }
    public required Customer Customer { get; set; }
    public PositionStatus Status { get; set; } = PositionStatus.Closed;
    public byte Number { get; set; } = 1;
    public required int ConsultantId { get; set; }
    public required HouYiUser Consultant { get; set; }

    [StringLength(Constants.StringLengths.Name)]
    public string ContactPerson { get; set; } = string.Empty;

    [StringLength(Constants.StringLengths.PhoneNumber)]
    public string ContactPhone { get; set; } = string.Empty;

    [StringLength(Constants.StringLengths.Text)]
    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    /// <summary>
    /// 已向本职位提交的简历数量，这是一个计算属性。
    /// </summary>
    [NotMapped]
    public int RecommendationsCount { get; set; }
}
