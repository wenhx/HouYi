using Microsoft.AspNetCore.Identity;

namespace HouYi.Models;

public class HouYiUser : IdentityUser<int>
{
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}