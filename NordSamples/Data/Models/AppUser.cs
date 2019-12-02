using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace NordSamples.Data.Models
{
    public class AppUser : IdentityUser
    {
        public int? NufUserId { get; set; }

    }
}