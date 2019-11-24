using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NordSamples.Services
{
    public class AuthMessageSenderOptions
    {
        //https://docs.microsoft.com/en-us/aspnet/core/security/authentication/accconfirm?view=aspnetcore-3.0&tabs=visual-studio
        public string SendGridUser { get; set; }
        public string SendGridKey { get; set; }
    }
}
