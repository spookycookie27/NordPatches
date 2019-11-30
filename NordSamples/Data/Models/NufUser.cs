using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NordSamples.Data.Models
{
    public class NufUser
    {
        public int Id { get; set; }

        [MaxLength(255)]
        public string Username { get; set; }

        [MaxLength(40)]
        public string Password { get; set; }

        [MaxLength(255)]
        public string Email { get; set; }
    }
}
