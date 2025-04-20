using HouYi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Data;

public class HouYiDbContext : IdentityDbContext<HouYiUser, IdentityRole<int>, int>
{
    public HouYiDbContext(DbContextOptions<HouYiDbContext> options) : base(options)
    {
        Customers = Set<Customer>();
        Positions = Set<Position>();
        Resumes = Set<Resume>();
        ReferenceData = Set<ReferenceData>();
        LeveledReferenceData = Set<LeveledReferenceData>();
        Places = Set<Place>();
        Recommendations = Set<Recommendation>();
        Interviews = Set<Interview>();
    }

    public DbSet<Customer> Customers { get; init; }
    public DbSet<Position> Positions { get; init; }
    public DbSet<Resume> Resumes { get; init; }
    public DbSet<LeveledReferenceData> LeveledReferenceData { get; init; }
    public DbSet<ReferenceData> ReferenceData { get; init; }
    public DbSet<Place> Places { get; init; }
    public DbSet<Recommendation> Recommendations { get; init; }
    public DbSet<Interview> Interviews { get; init; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<HouYiUser>()
            .Property(u => u.Id)
            .UseIdentityColumn(10000, 1); // 起始值为 10000，增量为 1
        modelBuilder.Entity<IdentityRole<int>>()
            .Property(r => r.Id)
            .UseIdentityColumn(100, 1); // 起始值为 100，增量为 1
        modelBuilder.Entity<Customer>()
            .Property(c => c.Id)
            .UseIdentityColumn(10000, 1); // 起始值为 10000，增量为 1

        modelBuilder.Entity<ReferenceData>().UseTpcMappingStrategy();
    }
}