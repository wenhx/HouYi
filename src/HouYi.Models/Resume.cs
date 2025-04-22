using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace HouYi.Models;

public class Resume
{
    [StringLength(Constants.StringLengths.GUID)]
    public required string Id { get; init; }

    [StringLength(Constants.StringLengths.Name)]
    public required string Name { get; init; }

    public Gender Gender { get; init; } = Gender.PreferNotToSay;

    [Range(Constants.Integers.MinimumAge, Constants.Integers.MaximumAge, ErrorMessage = "年龄必须大于{1}岁，小于{2}岁。")]
    public byte Age { get; init; }

    [StringLength(Constants.StringLengths.PhoneNumber, ErrorMessage = "手机号码的长度必须是{1}位。")]
    [RegularExpression(@"^(13)\d{9}$", ErrorMessage = "手机号码不正确。")]
    public required string Phone { get; init; }

    [StringLength(Constants.StringLengths.Email)]
    public required string Email { get; init; }

    public EmploymentStatus Status { get; init; }

    [StringLength(Constants.StringLengths.Name)]
    public string Position { get; init; } = String.Empty;

    public EducationLevel HighestEducation { get; init; } = EducationLevel.Unknown;

    [Range(0, Int16.MaxValue)]
    public short AnnualSalary { get; init; }

    public byte YearsOfExperience { get; set; }

    /// <summary>
    /// The candidate's current city code of residence.
    /// </summary>
    public short PlaceId { get; init; }

    public Place Place { get; set; }

    /// <summary>
    /// A code represents the source of this resume, and this code is predefined by the system.
    /// </summary>
    public required ResumeSource Source { get; init; }

    /// <summary>
    /// The note for the resume.
    /// It can be a summary of a resume or comments made by a consultant on this resume.
    /// </summary>
    [StringLength(Constants.StringLengths.LongText)]
    public string Note { get; init; } = String.Empty;

    public required DateTime CreatedAt { get; init; } = DateTime.Now;
    public required DateTime UpdatedAt { get; set; } = DateTime.Now;
}