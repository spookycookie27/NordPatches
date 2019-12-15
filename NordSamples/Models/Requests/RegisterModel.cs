using System.ComponentModel.DataAnnotations;

namespace NordSamples.Models.Requests
{
    public class RegisterModel
    {
        [Required]
        [StringLength(16, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 5)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(30, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 5)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [StringLength(6, ErrorMessage = "The {0} must be max {1} characters long.")]
        public string ActivationCode { get; set; }
    }
}
