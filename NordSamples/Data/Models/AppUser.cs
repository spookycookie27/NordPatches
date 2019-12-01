using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace NordSamples.Data.Models
{
    public class AppUser : IdentityUser
    {
        public virtual ICollection<IdentityUserRole<string>> UserRoles { get; set; }
    }
}