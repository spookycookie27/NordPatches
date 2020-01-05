using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NordSamples.Models
{
    public class Patch
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 3)]
        public string Name { get; set; }
        public string Description { get; set; }
        public string Link { get; set; }

        [Required]
        [Range(1, 7, ErrorMessage = "Invalid InstrumentId")]
        public int InstrumentId { get; set; }

        [Range(1, 30, ErrorMessage = "Invalid CategoryId")]
        public int? CategoryId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }

        public User User { get; set; }
        public int? ParentPatchId { get; set; }
        public bool Removed { get; set; }

        public ICollection<PatchFile> PatchFiles { get; set; }
        public ICollection<Tag> Tags { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Rating> Ratings { get; set; }
        public ICollection<Patch> Children { get; set; }
    }
}
