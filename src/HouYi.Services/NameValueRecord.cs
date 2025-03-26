using System.ComponentModel.DataAnnotations;

namespace HouYi.Services;

public record NameValueRecord<T>([Required]string Name, [Required]T Value);