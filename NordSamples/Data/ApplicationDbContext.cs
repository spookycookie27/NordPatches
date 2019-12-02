using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NordSamples.Data.Models;

namespace NordSamples.Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>().ToTable("AspNetUsers");
            modelBuilder.Entity<Patch>().ToTable("Patch");
            modelBuilder.Entity<File>().ToTable("File")
                .Property(b => b.DateCreated)
                .HasDefaultValueSql("getDate()");
            modelBuilder.Entity<Category>().ToTable("Category");
            modelBuilder.Entity<Tag>().ToTable("Tags");
            modelBuilder.Entity<Instrument>().ToTable("Instrument");
            modelBuilder.Entity<NufUser>().ToTable("NufUser");
            modelBuilder.Entity<AppUser>().ToTable("AspNetUsers");
        }

        public DbSet<Patch> Patches { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Instrument> Instruments { get; set; }
        public DbSet<NufUser> NufUsers { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
    }
}
