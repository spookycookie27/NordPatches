using System;

namespace NordSamples.Data.Models
{
    public class File
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime DateCreated { get; set; }

        public int PatchId { get; set; }
        public Patch Patch { get; set; }
    }
}
