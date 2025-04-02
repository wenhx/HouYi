using HouYi.Models;
using HouYi.Models.Resumes;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace HouYi.Data;

public class HouYiDbContext : IdentityDbContext<HouYiUser>
{
    public HouYiDbContext(DbContextOptions<HouYiDbContext> options) : base(options)
    {
        Resumes = Set<Resume>();
        ReferenceData = Set<ReferenceData>();
        LeveledReferenceData = Set<LeveledReferenceData>();
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<ReferenceData>().UseTpcMappingStrategy();
    }

    public DbSet<Resume> Resumes { get; init; }
    public DbSet<ReferenceData> ReferenceData { get; init; }
    public DbSet<LeveledReferenceData> LeveledReferenceData { get; init; }
}