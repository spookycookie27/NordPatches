using System.ComponentModel.DataAnnotations;

namespace NordSamples.Models
{
    public class LoginModel
    {
        [Required]
        [StringLength(16, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 5)]
        public string Username { get; set; }

        [Required]
        [StringLength(30, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 5)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public bool RememberMe => false;
    }
}
