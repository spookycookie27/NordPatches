
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;
using NordSamples.Data;
using NordSamples.Data.Constants;


namespace ContactManager.Data
{
    public static class SeedUserRoles
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            string testUserPw = "Passw0rd1!";
            using (var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                var adminID = await EnsureUser(serviceProvider, testUserPw, "sp.cooke@me.com");
                await EnsureRole(serviceProvider, adminID, Constants.AdministratorRole);

                // allowed user can create and edit contacts that they create
                var managerID = await EnsureUser(serviceProvider, testUserPw, "sp.cooke@icloud.com");
                await EnsureRole(serviceProvider, managerID, Constants.UserRole);

                var uid = await CreateTestUser(serviceProvider, testUserPw);

            }
        }

        private static async Task<string> EnsureUser(IServiceProvider serviceProvider,
            string testUserPw, string userName)
        {
            var userManager = serviceProvider.GetService<UserManager<IdentityUser>>();

            var user = await userManager.FindByNameAsync(userName);
            if (user == null)
            {
                user = new IdentityUser { UserName = userName, Email = userName };
                var result = await userManager.CreateAsync(user, testUserPw);
            }

            return user.Id;
        }

        private static async Task<IdentityResult> EnsureRole(IServiceProvider serviceProvider,
            string uid, string role)
        {
            IdentityResult IR = null;
            var roleManager = serviceProvider.GetService<RoleManager<IdentityRole>>();

            if (roleManager == null)
            {
                throw new Exception("roleManager null");
            }

            if (!await roleManager.RoleExistsAsync(role))
            {
                IR = await roleManager.CreateAsync(new IdentityRole(role));
            }

            var userManager = serviceProvider.GetService<UserManager<IdentityUser>>();

            var user = await userManager.FindByIdAsync(uid);

            IR = await userManager.AddToRoleAsync(user, role);

            return IR;
        }

        private static async Task<string> CreateTestUser(IServiceProvider serviceProvider, string testUserPw)
        {
            if (String.IsNullOrEmpty(testUserPw))
                return "";

            const string SeedUserName = "test@example.com";

            var userManager = serviceProvider.GetService<UserManager<IdentityUser>>();

            var user = await userManager.FindByNameAsync(SeedUserName);
            if (user == null)
            {
                user = new IdentityUser { UserName = SeedUserName };
                await userManager.CreateAsync(user, testUserPw);
            }

            return user.Id;
        }
    }
}