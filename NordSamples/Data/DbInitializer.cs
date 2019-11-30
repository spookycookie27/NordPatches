using System;
using System.Linq;
using NordSamples.Data.Models;

namespace NordSamples.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            // Look for any patches.
            if (context.Patches.Any())
            {
                return;   // DB has been seeded
            }

            var patches = new[]
            {
                new Patch {Name = "Patch1"},
                new Patch {Name = "Patch2"},
            };

            foreach (Patch patch in patches)
            {
                context.Patches.Add(patch);
            }
            context.SaveChanges();


            var files = new File[]
            {
                new File {Name = "File1", DateCreated = DateTime.Parse("2019-09-01"), PatchId = 1},
                new File {Name = "File2", DateCreated = DateTime.Parse("2017-09-01"), PatchId = 1},
                new File {Name = "File3", DateCreated = DateTime.Parse("2018-09-01"), PatchId = 2},
                new File {Name = "File4", DateCreated = DateTime.Parse("2017-09-01"), PatchId = 2}
            };
            foreach (File file in files)
            {
                context.Files.Add(file);
            }
            context.SaveChanges();
        }
    }
}
