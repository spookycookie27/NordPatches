using System;
using System.Collections.Generic;

namespace NordSamples.Models.ViewModels
{
    public class Patch
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Link { get; set; }
        public int InstrumentId { get; set; }
        public int? CategoryId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public Instrument Instrument { get; set; }
        public Category Category { get; set; }
        public User User { get; set; }

        public Patch Parent { get; set; }
        public ICollection<File> Files { get; set; }
        public ICollection<Tag> Tags { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Patch> Children { get; set; }
    }
}
