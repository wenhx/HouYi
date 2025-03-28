using System.ComponentModel.DataAnnotations;

namespace HouYi.Infrastructure;

public record NameValueRecord<T>([Required]string Name, [Required]T Value);