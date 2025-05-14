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

    public FutureDateAttribute()
    {
        ErrorMessage = "面试时间必须在{0}小时之后";
    }

    public override string FormatErrorMessage(string name)
    {
        return string.Format(ErrorMessageString, AfterHours);
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is DateTime dateTime)
        {
            // 获取当前验证的对象
            var interview = validationContext.ObjectInstance as Interview;
            if (interview == null)
                return new ValidationResult("验证对象类型错误");

            // 如果是新创建的面试（Id为0）或者面试时间被修改了，才进行验证
            if (interview.Id == 0 || interview.InterviewTime != dateTime)
            {
                if (dateTime <= DateTime.Now.AddHours(_afterHours))
                    return new ValidationResult(FormatErrorMessage(validationContext.DisplayName));
            }
        }
        return ValidationResult.Success;
    }
}