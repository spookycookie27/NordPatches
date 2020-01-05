using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using NordSamples.Data;
using NordSamples.Data.Constants;
using NordSamples.Data.Models;

namespace NordSamples.Services
{
    public class UserPatchEditHandler : AuthorizationHandler<UserPatchEditRequirement>
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly ApplicationDbContext context;

        public UserPatchEditHandler(IHttpContextAccessor httpContextAccessor, ApplicationDbContext context)
        {
            this.httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            this.context = context ?? throw new ArgumentNullException(nameof(context));
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserPatchEditRequirement requirement)
        {

            bool isAuthorized = false;
            ClaimsPrincipal user = context.User;
            if (user.Identity.IsAuthenticated)
            {
                isAuthorized = user.IsInRole(Constants.AdministratorRole) || UserCanEdit(user);
            }

            if (isAuthorized)
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }


            return Task.CompletedTask;
        }

        private bool UserCanEdit(ClaimsPrincipal user)
        {
            string appUserId = user.Claims.SingleOrDefault(x => x.Type == ClaimTypes.Sid)?.Value;
            string nufUserId = user.Claims.SingleOrDefault(x => x.Type == ClaimTypes.PrimarySid)?.Value;
            RouteData routeData = httpContextAccessor.HttpContext.GetRouteData();
            int.TryParse(routeData.Values["id"].ToString(), out int patchId);
            Patch patch = context.Patches.Find(patchId);
            if (patch == null)
            {
                return false;
            }

            return patch.AppUserId == appUserId || patch.NufUserId != null && patch.NufUserId.ToString() == nufUserId;
        }
    }
}
