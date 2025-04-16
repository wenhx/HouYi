using HouYi.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Data;

public class HouYiDbContext : IdentityDbContext<HouYiUser>
{
    public HouYiDbContext(DbContextOptions<HouYiDbContext> options) : base(options)
    {
        Customers = Set<Customer>();
    }

    public DbSet<Customer> Customers { get; init; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Customer>()
            .Property(c => c.Id)
            .UseIdentityColumn(10000, 1); // 起始值为 10000，增量为 1
    }
}