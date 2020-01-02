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
            modelBuilder.Entity<Patch>().ToTable("Patch")
                .Property(p => p.Removed)
                .HasDefaultValue(0);
            modelBuilder.Entity<Patch>().ToTable("Patch")
                .HasMany(t => t.Tags);

            modelBuilder.Entity<File>().ToTable("File")
                .Property(f => f.DateCreated)
                .HasDefaultValueSql("getDate()");
            modelBuilder.Entity<File>().ToTable("File")
                .Property(p => p.Removed)
                .HasDefaultValue(0);

            modelBuilder.Entity<Tag>().ToTable("Tag")
                .HasKey(t => new { t.PatchId, t.Name });

            modelBuilder.Entity<Category>().ToTable("Category");
            modelBuilder.Entity<Rating>().ToTable("Rating")
                .HasKey(r => new { r.AppUserId, r.PatchId });
            modelBuilder.Entity<Instrument>().ToTable("Instrument");
            modelBuilder.Entity<NufUser>().ToTable("NufUser");
            modelBuilder.Entity<AppUser>().ToTable("AspNetUsers");
            modelBuilder.Entity<Comment>().ToTable("Comment");

            modelBuilder.Entity<PatchFile>()
                .HasKey(t => new { t.PatchId, t.FileId });

            modelBuilder.Entity<PatchFile>()
                .HasOne(pt => pt.Patch)
                .WithMany(p => p.PatchFiles)
                .HasForeignKey(pt => pt.PatchId);

            modelBuilder.Entity<PatchFile>()
                .HasOne(pt => pt.File)
                .WithMany(t => t.PatchFiles)
                .HasForeignKey(pt => pt.FileId);
        }

        public DbSet<Patch> Patches { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Instrument> Instruments { get; set; }
        public DbSet<NufUser> NufUsers { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
    }
}
