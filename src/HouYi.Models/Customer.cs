using System.ComponentModel.DataAnnotations;

namespace HouYi.Models;

public class Customer
{
    public int Id { get; init; }

    [StringLength(Constants.StringLengths.Name)]
    public string Name { get; set; } = string.Empty;

    [StringLength(Constants.StringLengths.Name)]
    public string ContactPerson { get; set; } = string.Empty;

    [StringLength(Constants.StringLengths.Email)]
    public string Email { get; set; } = string.Empty;

    [StringLength(Constants.StringLengths.PhoneNumber)]
    public string Phone { get; set; } = string.Empty;

    [StringLength(Constants.StringLengths.Address)]
    public string Address { get; set; } = string.Empty;

    [StringLength(Constants.StringLengths.Description)]
    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}