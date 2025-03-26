using System.ComponentModel.DataAnnotations;

namespace HouYi.Models.Resumes;

public class Resume
{
    #region Props
    [StringLength(Constants.StringLengths.GUID)]
    public required string Id { get; init; }

    [StringLength(Constants.StringLengths.Name)]
    public required string Name { get; init; }

    public Gender Gender { get; init; } = Gender.PreferNotToSay;

    [Range(Constants.Integers.MinimumAge, Constants.Integers.MaximumAge)]
    public byte Age { get; init; }

    [StringLength(Constants.StringLengths.PhoneNumber)]
    [RegularExpression(@"^(13)\d{9}$", ErrorMessage = "手机号码不正确。")]
    public required string Phone { get; init; }

    [StringLength(Constants.StringLengths.Email)]
    public required string Email { get; init; }

    public CurrentStatus CurrentStatus { get; init; }

    [StringLength(Constants.StringLengths.Name)]
    public string Position { get; init; } = String.Empty;

    public Degree Degree { get; init; } = Degree.Unknown;

    [Range(0, Int16.MaxValue)]
    public short AnnualSalary { get; init; }

    /// <summary>
    /// The candidate's current city code of residence.
    /// </summary>
    public short City { get; init; }

    /// <summary>
    /// A code represents the source of this resume, and this code is predefined by the system.
    /// </summary>
    public required byte Source { get; init; }

    /// <summary>
    /// The note for the resume.
    /// It can be a summary of a resume or comments made by a consultant on this resume.
    /// </summary>
    [StringLength(Constants.StringLengths.LongText)]
    public string Note { get; init; } = String.Empty;

    public required DateTime CreatedAt { get; init; } = DateTime.Now;
    public required DateTime UpdatedAt { get; set; } = DateTime.Now;
    #endregion
}
