using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Data;

public class HouYiDbContext(DbContextOptions<HouYiDbContext> options) : IdentityDbContext<HouYiUser>(options)
{
}
