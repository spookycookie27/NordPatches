using System.ComponentModel.DataAnnotations;

namespace NordSamples.Data.Models
{
    public class Tag
    {
        public int Id { get; set; }
        [MaxLength(255)]
        public string Name { get; set; }

        public int PatchId { get; set; }
        public Patch Patch { get; set; }
    }
}
