using System;

namespace NordSamples.Models.ViewModels
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
        public string AppUserId { get; set; }
        public int PatchId { get; set; }
    }
}
