using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace NordSamples.Data
{
    public class NordAppUser : IdentityUser
    {
        public virtual ICollection<IdentityUserRole<string>> UserRoles { get; set; }
    }
}