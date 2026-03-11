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
        Communications = Set<Communication>();
        OperationLogs = Set<OperationLog>();
        Messages = Set<Message>();
        MessageContents = Set<MessageContent>();
    }

    public DbSet<Customer> Customers { get; init; }
    public DbSet<Position> Positions { get; init; }
    public DbSet<Resume> Resumes { get; init; }
    public DbSet<LeveledReferenceData> LeveledReferenceData { get; init; }
    public DbSet<ReferenceData> ReferenceData { get; init; }
    public DbSet<Place> Places { get; init; }
    public DbSet<Recommendation> Recommendations { get; init; }
    public DbSet<Interview> Interviews { get; init; }
    public DbSet<Communication> Communications { get; init; }
    public DbSet<OperationLog> OperationLogs { get; init; }
    public DbSet<Message> Messages { get; init; }
    public DbSet<MessageContent> MessageContents { get; init; }

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
        modelBuilder.Entity<Interview>()
            .HasOne(i => i.Recommendation)
            .WithMany().HasForeignKey(i => i.RecommendationId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Receiver)
            .WithMany()
            .HasForeignKey(m => m.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Content)
            .WithMany()
            .HasForeignKey(m => m.ContentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
