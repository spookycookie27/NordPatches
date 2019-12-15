using System.ComponentModel.DataAnnotations;

namespace NordSamples.Models.ViewModels
{
    public class BlobUrlModel
    {
            [Required]
            public string BlobUrl { get; set; }

            [Required]
            public string Name { get; set; }

    }
}