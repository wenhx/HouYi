using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace HouYi.Models;

public class Resume
{
    [StringLength(Constants.StringLengths.GUID)]
    public string Id { get; init; } = Guid.NewGuid().ToString();

    [StringLength(Constants.StringLengths.Name)]
    public required string Name { get; set; }

    public Gender Gender { get; set; } = Gender.PreferNotToSay;

    [Range(Constants.Integers.MinimumAge, Constants.Integers.MaximumAge, ErrorMessage = "年龄必须大于{1}岁，小于{2}岁。")]
    public required byte Age { get; set; }

    [StringLength(Constants.StringLengths.PhoneNumber, ErrorMessage = "手机号码的长度必须是{1}位。")]
    [RegularExpression(@"^(13)\d{9}$", ErrorMessage = "手机号码不正确。")]
    public required string Phone { get; set; }

    [StringLength(Constants.StringLengths.Email)]
    public required string Email { get; set; }

    public EmploymentStatus Status { get; set; } = EmploymentStatus.Unknown;

    [StringLength(Constants.StringLengths.Name)]
    public string Position { get; set; } = String.Empty;

    public EducationLevel HighestEducation { get; set; } = EducationLevel.Unknown;

    [Range(0, Int16.MaxValue)]
    public short AnnualSalary { get; set; }

    public byte YearsOfExperience { get; set; }

    /// <summary>
    /// The candidate's current city id of residence.
    /// </summary>
    public short PlaceId { get; set; }

    public Place? Place { get; set; }

    /// <summary>
    /// A code represents the source of this resume, and this code is predefined by the system.
    /// </summary>
    public required ResumeSource Source { get; set; }

    /// <summary>
    /// The note for the resume.
    /// It can be a summary of a resume or comments made by a consultant on this resume.
    /// </summary>
    [StringLength(Constants.StringLengths.LongText)]
    public string Note { get; set; } = String.Empty;

    public DateTime CreatedAt { get; init; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public static Resume Default(byte age = 0)
    {
        //CreatedAt, UpdatedAt 有默认值。
        return new Resume
        {
            Id = Guid.Empty.ToString(),
            Name = string.Empty,
            Gender = Gender.PreferNotToSay,
            Age = age,
            Phone = string.Empty,
            Email = string.Empty,
            Status = EmploymentStatus.Unknown,
            Position = string.Empty,
            HighestEducation = EducationLevel.Unknown,
            AnnualSalary = 0,
            YearsOfExperience = 0,
            Source = ResumeSource.Others,
            Note = string.Empty,
            PlaceId = 0
        };
    }

    public Resume Clone()
    {
        //Id, CreatedAt, UpdatedAt 有默认值。
        return new Resume
        {
            Age = Age,
            AnnualSalary = AnnualSalary,
            Email = Email,
            Gender = Gender,
            HighestEducation = HighestEducation,
            Name = Name,
            Note = Note,
            Phone = Phone,
            Place = Place,
            PlaceId = PlaceId,
            Position = Position,
            Source = Source,
            Status = Status,
            YearsOfExperience = YearsOfExperience
        };
    }

    public bool IsDefault => Id == Guid.Empty.ToString();
}