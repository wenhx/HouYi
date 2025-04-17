using Microsoft.AspNetCore.Identity;

namespace HouYi.Models;

public class HouYiUser : IdentityUser<int>
{
    public DateTime CreateAt { get; set; } = DateTime.Now;
    public DateTime UpdateAt { get; set; } = DateTime.Now;
}