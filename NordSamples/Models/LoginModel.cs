using System.ComponentModel.DataAnnotations;

namespace NordSamples.Models
{
    public class LoginModel
    {
        [Required]
        public string Login { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public bool RememberMe => false;
    }
}
