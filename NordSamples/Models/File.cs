using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NordSamples.Models
{
    public class File
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Comment { get; set; }
        public string Extension { get; set; }
        public int Version { get; set; }
        public int? Size { get; set; }
        public DateTime DateCreated { get; set; }
        public int? NufUserId { get; set; }
        public int AttachId { get; set; }
        public string AppUserId { get; set; }
        public bool IsBlob { get; set; }
        public bool IsNord { get; set; }
        public bool Removed { get; set; }

        public ICollection<PatchFile> PatchFiles { get; set; }
    }
}
