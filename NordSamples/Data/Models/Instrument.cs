using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NordSamples.Data.Models
{
    public class Instrument
    {
        public int Id { get; set; }

        [MaxLength(50)]
        public string Name { get; set; }

        [MaxLength(255)]
        public string Description { get; set; }

        public ICollection<Patch> Patches { get; set; } = new List<Patch>();
    }
}
