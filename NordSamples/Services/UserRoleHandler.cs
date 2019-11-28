using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using NordSamples.Data.Constants;

namespace NordSamples.Services
{
    public class UserRoleHandler : AuthorizationHandler<UserRoleRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserRoleRequirement requirement)
        {
            if (context.Resource is AuthorizationFilterContext authContext)
            {
                bool isAuthorized = false;
                ClaimsPrincipal user = context.User;
                if (user.Identity.IsAuthenticated)
                {
                    isAuthorized = user.IsInRole(Constants.AdministratorRole) || user.IsInRole(Constants.UserRole);
                }

                if (isAuthorized)
                {
                    context.Succeed(requirement);
                }
                else
                {
                    context.Fail();
                }
            }

            return Task.CompletedTask;
        }
    }
}
