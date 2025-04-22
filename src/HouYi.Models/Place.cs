using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HouYi.Models;

public class Place
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public short Id { get; init; }

    [StringLength(Constants.StringLengths.Name)]
    public string Code { get; init; } = string.Empty;

    [StringLength(Constants.StringLengths.Name)]
    public required string Name { get; init; }

    public int SortOrder { get; set; }

    public bool IsDeleted { get; set; } = false;

    public int Level { get; set; }

    public int? ParentId { get; set; }

    public DateTime CreatedAt { get; init; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}