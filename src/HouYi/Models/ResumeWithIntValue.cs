using System.Diagnostics.CodeAnalysis;

namespace HouYi.Models;

public class ResumeWithIntValue : Resume
{
    public int IntAge
    {
        get
        {
            return Age;
        }
        set
        {
            Age = (byte)value;
        }
    }
    public int IntAnnualSalary
    {
        get
        {
            return AnnualSalary;
        }
        set
        {
            AnnualSalary = (short)value;
        }
    }
    public int IntYearsOfExperience
    {
        get
        {
            return YearsOfExperience;
        }
        set
        {
            YearsOfExperience = (byte)value;
        }
    }

    [SetsRequiredMembers]
    public ResumeWithIntValue(Resume resume)
    {
        if (resume == null)
            throw new ArgumentNullException(nameof(resume));

        Id = resume.Id;
        Name = resume.Name;
        Gender = resume.Gender;
        Age = resume.Age;
        Phone = resume.Phone;
        Email = resume.Email;
        Position = resume.Position;
        Status = resume.Status;
        HighestEducation = resume.HighestEducation;
        AnnualSalary = resume.AnnualSalary;
        YearsOfExperience = resume.YearsOfExperience;
        PlaceId = resume.PlaceId;
        Place = resume.Place;
        Source = resume.Source;
        Note = resume.Note;
        CreatedAt = resume.CreatedAt;
        UpdatedAt = resume.UpdatedAt;
    }
}
