using System.ComponentModel.DataAnnotations;

namespace NordSamples.Models
{
    public class ForgotPasswordModel
    {       
            [Required]
            [EmailAddress]
            public string Email { get; set; }
    }
}
