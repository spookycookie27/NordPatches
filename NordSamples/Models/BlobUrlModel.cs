using System.ComponentModel.DataAnnotations;

namespace NordSamples.Models
{
    public class BlobUrlModel
    {       
            [Required]
            public string BlobUrl { get; set; }

            [Required]
            public string Name { get; set; }

    }
}