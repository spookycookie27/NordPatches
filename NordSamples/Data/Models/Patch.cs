using System;
using System.Collections.Generic;
using NordSamples.Data.Enum;

namespace NordSamples.Data.Models
{
    public class Patch
    {
        public int Id { get; set; }
        public Instrument? Instrument { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string SongName { get; set; }
        public string ArtistName { get; set; }
        public DateTime DateCreated { get; set; }

        public ICollection<File> Files { get; set; } = new List<File>();
    }
}
