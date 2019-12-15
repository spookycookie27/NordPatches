using System.ComponentModel.DataAnnotations;

namespace NordSamples.Models.Requests
{
    public class ForgotPasswordModel
    {       
            [Required]
            [EmailAddress]
            public string Email { get; set; }
    }
}
