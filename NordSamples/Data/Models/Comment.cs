using System;
using System.ComponentModel.DataAnnotations;

namespace NordSamples.Data.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime DateCreated { get; set; }
        [Required] public string AppUserId { get; set; }
        public int PatchId { get; set; }

        public AppUser AppUser { get; set; }
        public Patch Patch { get; set; }
    }
}
