using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace HouYi.Infrastructure;

public static class ValidationHelper
{
    public static InvokedResult ValidateProperty<TModel, TValue>(string propertyName, TValue value)
    {
        if (propertyName == null)
            throw new ArgumentNullException(nameof(propertyName));
        if (string.IsNullOrEmpty(propertyName))
            throw new ArgumentException("属性名不能为空。");

        var property = typeof(TModel).GetProperty(propertyName);
        if (property == null)
            return InvokedResult.Failure($"属性 {propertyName} 不存在");

        return ValidateProperty<TModel, TValue>(property, value);
    }

    public static InvokedResult ValidateProperty<TModel, TValue>(PropertyInfo property, TValue value)
    {
        if (property == null)
            throw new ArgumentNullException(nameof(property));

        var validationAttributes = property.GetCustomAttributes(typeof(ValidationAttribute), false)
                                          .Cast<ValidationAttribute>();
        foreach (var attribute in validationAttributes)
        {
            var result = attribute.GetValidationResult(value,
                new ValidationContext(string.Empty));//使用string.Empty作为参数，因为属性验证不需要对象实例
            if (result != ValidationResult.Success)
                return InvokedResult.Failure(result?.ErrorMessage ?? $"属性{property.Name}校验失败。");
        }

        return InvokedResult.Success;
    }
}