using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NordSamples.Data.Models;

namespace NordSamples.Data
{
    public class ApplicationDbContext : IdentityDbContext<NordAppUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<NordAppUser>(b =>
            {

                // Each User can have many entries in the UserRole join table
                b.HasMany(e => e.UserRoles)
                    .WithOne()
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });

            modelBuilder.Entity<Patch>().ToTable("Patch");
            modelBuilder.Entity<File>().ToTable("File");
            modelBuilder.Entity<NufUser>().ToTable("NufUser");
        }

        public DbSet<Patch> Patches { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<NufUser> NufUsers { get; set; }
    }
}
