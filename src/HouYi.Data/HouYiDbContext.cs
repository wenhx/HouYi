using HouYi.Models.Resumes;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Data;

public class HouYiDbContext : IdentityDbContext<HouYiUser>
{
    public HouYiDbContext(DbContextOptions<HouYiDbContext> options) : base(options)
    {
        Resumes = Set<Resume>();
    }

    public DbSet<Resume> Resumes { get; private set; }
}
