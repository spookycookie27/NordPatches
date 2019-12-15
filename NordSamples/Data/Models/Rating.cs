using System.ComponentModel.DataAnnotations;

namespace NordSamples.Data.Models
{
    public class Rating
    {
        public int Id { get; set; }

        [MaxLength(255)]
        public int Value { get; set; }

        public int PatchId { get; set; }
        public Patch Patch { get; set; }
    }
}