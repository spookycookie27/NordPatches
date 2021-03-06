using System.ComponentModel.DataAnnotations;

namespace NordSamples.Data.Models
{
    public class Rating
    {
        [MaxLength(450)]
        public string AppUserId { get; set; }

        public int PatchId { get; set; }

        public int Value { get; set; }
    }
}