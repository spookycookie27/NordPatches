using System.Linq;
using Microsoft.EntityFrameworkCore;
using NordSamples.Data.Models;

namespace NordSamples.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.OpenConnection();

            try
            {
                AddInitialCategories(context);
                AddInitialInstruments(context);
            }
            finally
            {
                context.Database.CloseConnection();
            }
        }

        private static void AddInitialInstruments(ApplicationDbContext context)
        {
            if (!context.Instruments.Any())
            {
                var instruments = new[]
                {
                    new Instrument {Name = "UserSample", Id = 1},
                    new Instrument {Name = "Lead", Id = 2},
                    new Instrument {Name = "Electro", Id = 3},
                    new Instrument {Name = "Stage1", Id = 4},
                    new Instrument {Name = "Stage2", Id = 5},
                    new Instrument {Name = "Stage3", Id = 6},
                };
                foreach (Instrument i in instruments)
                {
                    context.Instruments.Add(i);
                }

                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.Instrument ON");
                context.SaveChanges();
                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.Instrument OFF");
            }
        }

        private static void AddInitialCategories(ApplicationDbContext context)
        {
            if (!context.Categories.Any())
            {
                var categories = new[]
                {
                    new Category {Name = "Synth", Id = 1, Description = null},
                    new Category {Name = "Lead", Id = 2, Description = null},
                    new Category {Name = "Strings", Id = 3, Description = null},
                    new Category {Name = "Brass", Id = 4, Description = null},
                    new Category {Name = "Pads", Id = 5, Description = null},
                    new Category {Name = "Bass", Id = 6, Description = null},
                    new Category {Name = "Guitar", Id = 7, Description = null},
                    new Category {Name = "Drums", Id = 8, Description = null},
                    new Category {Name = "Percussion", Id = 9, Description = null},
                    new Category {Name = "Effects", Id = 10, Description = null},
                    new Category {Name = "Electronic", Id = 11, Description = null},
                    new Category {Name = "Ethnic", Id = 12, Description = null},
                    new Category {Name = "Organ", Id = 13, Description = null},
                    new Category {Name = "Wind", Id = 14, Description = null},
                    new Category {Name = "Vocal", Id = 15, Description = null},
                    new Category {Name = "Upright", Id = 16, Description = null},
                    new Category {Name = "Pluck", Id = 17, Description = null},
                    new Category {Name = "Grand", Id = 18, Description = null},
                    new Category {Name = "Fantasy", Id = 19, Description = null},
                    new Category {Name = "EPiano", Id = 20, Description = null},
                    new Category {Name = "Clavinet", Id = 21, Description = null},
                    new Category {Name = "Arpeggio", Id = 22, Description = null},
                    new Category {Name = "Acoustic", Id = 23, Description = null},
                    new Category {Name = "Nature", Id = 24, Description = null},
                };

                foreach (Category c in categories)
                {
                    context.Categories.Add(c);
                }

                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.Category ON");
                context.SaveChanges();
                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.Category OFF");
            }
        }
    }
}
