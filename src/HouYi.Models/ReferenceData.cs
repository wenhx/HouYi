using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HouYi.Models;

public class ReferenceData
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int Id { get; init; }

    [StringLength(Constants.StringLengths.Name)]
    public string Code { get; init; } = string.Empty;

    [StringLength(Constants.StringLengths.Name)]
    public required string Name { get; init; }

    [StringLength(Constants.StringLengths.Name)]
    public string Category { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public bool IsDeleted { get; set; } = false;

    [StringLength(Constants.StringLengths.Description)]
    public string Description { get; init; } = string.Empty;

    public DateTime CreatedAt { get; init; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}

public class LeveledReferenceData : ReferenceData
{
    public int Level { get; set; }

    public int? ParentId { get; set; }
}