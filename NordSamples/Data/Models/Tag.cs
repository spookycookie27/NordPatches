using System.ComponentModel.DataAnnotations;

namespace NordSamples.Data.Models
{
    public class Tag
    {
        public int PatchId { get; set; }

        [MaxLength(255)]
        public string Name { get; set; }

        public Patch Patch { get; set; }
    }
}
