using System;
using System.ComponentModel.DataAnnotations;

namespace NordSamples.Data.Models
{
    public class File
    {
        public int Id { get; set; }

        [MaxLength(255)] public string Name { get; set; }
        [MaxLength(1000)] public string Comment { get; set; }
        [MaxLength(8)] public string Extension { get; set; }
        public bool IsBlob { get; set; }
        public int Version { get; set; }
        public int? Size { get; set; }
        public DateTime DateCreated { get; set; }
        public int? NufUserId { get; set; }
        public string AppUserId { get; set; }

        public int PatchId { get; set; }
        public Patch Patch { get; set; }
    }
}
