using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [ForeignKey("Parent")]
        public int? ParentPatchId { get; set; }

        public NufUser NufUser { get; set; }
        public AppUser AppUser { get; set; }
        public Instrument Instrument { get; set; }
        public Category Category { get; set; }
        public Patch Parent { get; set; }
        public ICollection<File> Files { get; set; }
        public ICollection<Tag> Tags { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public virtual ICollection<Patch> Children { get; set; }
    }
}
