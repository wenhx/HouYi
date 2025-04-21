using System.ComponentModel.DataAnnotations;

namespace HouYi.Models;

public class FutureDateAttribute : ValidationAttribute
{
    private int _afterHours;

    public int AfterHours
    {
        get => _afterHours;
        set
        {
            if (value <= 0)
                throw new ArgumentOutOfRangeException(nameof(AfterHours), "AfterHours must be greater than 0.");

            _afterHours = value;
        }
    }

    public override bool IsValid(object? value)
    {
        if (value is DateTime dateTime)
        {
            return dateTime > DateTime.Now.AddHours(_afterHours);
        }
        return false;
    }
}