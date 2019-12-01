using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NordSamples.Data.Models;

namespace NordSamples.Data
{
    public static class UserRoleSeeder
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            const string testUserPw = "Passw0rd1!";
            await using var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());
            context.Database.EnsureCreated();

            string adminId = await EnsureUser(serviceProvider, testUserPw,"testAdmin", "admin@nordsamples.com");
            await EnsureRole(serviceProvider, adminId, Constants.Constants.AdministratorRole);

            // allowed user can create and edit contacts that they create
            string managerId = await EnsureUser(serviceProvider, testUserPw, "testUser", "user@nordsamples.com");
            IdentityResult role = await EnsureRole(serviceProvider, managerId, Constants.Constants.UserRole);
        }

        private static async Task<string> EnsureUser(IServiceProvider serviceProvider,
            string testUserPw, string userName, string emailAddress)
        {
            var userManager = serviceProvider.GetService<UserManager<AppUser>>();

            AppUser user = await userManager.FindByNameAsync(userName);
            if (user != null)
            {
                return user.Id;
            }

            user = new AppUser() { UserName = userName, Email = emailAddress};
            await userManager.CreateAsync(user, testUserPw);
            string code = await userManager.GenerateEmailConfirmationTokenAsync(user);
            await userManager.ConfirmEmailAsync(user, code);

            return user.Id;
        }

        private static async Task<IdentityResult> EnsureRole(IServiceProvider serviceProvider,
            string uid, string role)
        {
            var roleManager = serviceProvider.GetService<RoleManager<IdentityRole>>();

            if (roleManager == null)
            {
                throw new Exception("roleManager null");
            }

            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }

            var userManager = serviceProvider.GetService<UserManager<AppUser>>();

            AppUser user = await userManager.FindByIdAsync(uid.ToString());

            IdentityResult ir = await userManager.AddToRoleAsync(user, role);

            return ir;
        }

        //private static async Task<string> CreateTestUser(IServiceProvider serviceProvider, string testUserPw)
        //{
        //    if (string.IsNullOrEmpty(testUserPw))
        //    {
        //        return "";
        //    }

        //    const string seedUserName = "test@example.com";

        //    var userManager = serviceProvider.GetService<UserManager<NordAppUser>>();

        //    NordAppUser user = await userManager.FindByNameAsync(seedUserName);
        //    if (user != null)
        //    {
        //        return user.Id;
        //    }

        //    user = new NordAppUser { UserName = seedUserName };
        //    await userManager.CreateAsync(user, testUserPw);

        //    return user.Id;
        //}
    }
}