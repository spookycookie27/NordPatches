using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NordSamples.Data.Models
{
    public class Patch
    {
        public int Id { get; set; }
        [MaxLength(255)] public string Name { get; set; }
        public string Description { get; set; }
        public string Link { get; set; }
        public int InstrumentId { get; set; }
        public int? CategoryId { get; set; }
        public int? NufUserId { get; set; }
        public string AppUserId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public int PatchId { get; set; }

        public NufUser NufUser { get; set; }
        public AppUser AppUser { get; set; }
        public Instrument Instrument { get; set; }
        public Category Category { get; set; }
        public Patch Parent { get; set; }
        public ICollection<File> Files { get; set; } = new List<File>();
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
