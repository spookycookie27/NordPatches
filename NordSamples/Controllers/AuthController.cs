using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication;
using AutoMapper;
using NordSamples.Data.Constants;
using NordSamples.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Identity.UI.Services;
using System.Text.Encodings.Web;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;
using NordSamples.Data;
using Microsoft.EntityFrameworkCore;
using NordSamples.Data.Models;

namespace NordSamples.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly JwtOptions jwtOptions;
        private readonly SignInManager<AppUser> signInManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IMapper mapper;
        private readonly IEmailSender emailSender;
        private readonly ApplicationDbContext context;

        //public IList<AuthenticationScheme> ExternalLogins { get; set; }

        public AuthController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IOptions<JwtOptions> jwtOptions, SignInManager<AppUser> signInManager, IMapper mapper, IEmailSender emailSender, ApplicationDbContext context)
        {
            this.userManager = userManager;
            this.jwtOptions = jwtOptions.Value;
            this.signInManager = signInManager;
            this.mapper = mapper;
            this.emailSender = emailSender;
            this.context = context;
            this.roleManager = roleManager;
        }

        // POST: api/Auth/Register
        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            //ExternalLogins = (await signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var user = new AppUser { UserName = model.Login, Email = model.Email };
            IdentityResult result = await userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                //_logger.LogInformation("User created a new account with password.");

                await userManager.AddToRoleAsync(user, Constants.UserRole);
                string code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

                string callbackUrl = Url.Action("ConfirmEmail", "Auth", new { userId = user.Id, code }, Request.Scheme);

                await emailSender.SendEmailAsync(model.Email, "Confirm your email",
                    $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

                if (!userManager.Options.SignIn.RequireConfirmedAccount)
                {
                    await signInManager.SignInAsync(user, false);
                }
                return Ok();
            }

            return BadRequest();
        }

        // GET: api/Auth/ConfirmEmail
        [AllowAnonymous]
        [HttpGet("[action]")]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return BadRequest();
            }

            AppUser user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{userId}'.");
            }

            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
            IdentityResult result = await userManager.ConfirmEmailAsync(user, code);
            string url = result.Succeeded ? "/login" : "/error";
            return Redirect(url);
        }

        // POST: api/Auth/Login
        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Login(LoginModel loginModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

            AppUser appUser = await CheckCredentials(loginModel);

            if (appUser == null)
            {
                return Unauthorized();
            }

            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, set lockoutOnFailure: true

            IList<string> roles = await userManager.GetRolesAsync(appUser);
            bool isAdmin = roles.Contains(Constants.AdministratorRole);
            string roleToUse = isAdmin ? Constants.AdministratorRole : Constants.UserRole;

            DateTime tokenExpiry = DateTime.Now.AddMinutes(1);

            var claims = new[] {
                    new Claim(ClaimTypes.Name, appUser.Email),
                    new Claim(JwtRegisteredClaimNames.Sub, appUser.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Exp, $"{new DateTimeOffset(tokenExpiry).ToUnixTimeSeconds()}"),
                    new Claim(JwtRegisteredClaimNames.Nbf, $"{new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds()}") ,
                    new Claim(ClaimTypes.Role, roleToUse),
                };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                jwtOptions.Issuer,
                jwtOptions.Issuer,
                claims,
                expires: tokenExpiry,
                signingCredentials: credentials);

            var user = mapper.Map<UserViewModel>(appUser);
            user.Role = roleToUse;


            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), user, tokenExpiry });
        }

        private async Task<AppUser> CheckCredentials(LoginModel loginModel)
        {
            AppUser appUser;
            if (loginModel.UseNufCred)
            {
                appUser = await CheckNufLogin(loginModel);
            }
            else
            {
                appUser = await CheckIdentityLogin(loginModel);
            }

            return appUser;
        }

        private async Task<AppUser> CheckIdentityLogin(LoginModel loginModel)
        {
            AppUser appUser = null;
            SignInResult result = await signInManager.PasswordSignInAsync(loginModel.Login, loginModel.Password, loginModel.RememberMe,
                lockoutOnFailure: false);
            if (result.Succeeded)
            {
                appUser = await userManager.FindByNameAsync(loginModel.Login);
            }

            return appUser;
        }

        private async Task<AppUser> CheckNufLogin(LoginModel loginModel)
        {
            AppUser appUser = null;
            var phpBbCryptoServiceProvider = new PhpBbCryptoServiceProvider();
            NufUser nufUser = await context.NufUsers.FirstOrDefaultAsync(x => x.Username == loginModel.Login);
            if (nufUser != null && phpBbCryptoServiceProvider.PhpBbCheckHash(loginModel.Password, nufUser.Password))
            {
                appUser = await EnsureUser(loginModel.Password, loginModel.Login, nufUser.Email);
            }

            return appUser;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordModel login)
        {
            AppUser user = await userManager.FindByEmailAsync(login.Email);
            if (user == null || !(await userManager.IsEmailConfirmedAsync(user)))
            {
                // Don't reveal that the user does not exist or is not confirmed
                return BadRequest();
            }

            // For more information on how to enable account confirmation and password reset please
            // visit https://go.microsoft.com/fwlink/?LinkID=532713
            string code = await userManager.GeneratePasswordResetTokenAsync(user);
            string encoded = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            string callbackUrl = Url.Action("ResetPassword", "Auth", new { code = encoded }, Request.Scheme);


            await emailSender.SendEmailAsync(
                login.Email,
                "Reset Password",
                $"Please reset your password by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

            return Ok();
        }

        // GET: api/Auth/ResetPassword
        [AllowAnonymous]
        [HttpGet("[action]")]
        public IActionResult ResetPassword(string code = null)
        {
            return Redirect($"/resetPassword?code={code}");
        }

        // POST: api/Auth/ResetPassword
        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> ResetPassword(PasswordResetModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            string decoded = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Code));

            AppUser user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return NotFound($"Unable to load user with Email '{model.Email}'.");
            }

            IdentityResult result = await userManager.ResetPasswordAsync(user, decoded, model.Password);

            if (result.Succeeded)
            {
                return Ok();
            }

            foreach (IdentityError error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest();
        }


        // POST: api/Auth/Confirm
        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Confirm(CheckToken data)
        {
            var jwtHandler = new JwtSecurityTokenHandler();
            string email = jwtHandler.ReadJwtToken(data.Token).Subject;
            AppUser user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return NotFound();
            }

            var returnUser = mapper.Map<UserViewModel>(user);

            return Ok(returnUser);
        }

        private async Task<AppUser> EnsureUser(string password, string userName, string emailAddress)
        {

            AppUser user = await userManager.FindByNameAsync(userName);
            if (user != null)
            {
                return user;
            }

            user = new AppUser() { UserName = userName, Email = emailAddress };
            await userManager.CreateAsync(user, password);
            string code = await userManager.GenerateEmailConfirmationTokenAsync(user);
            await userManager.ConfirmEmailAsync(user, code);
            await EnsureRole(user, Constants.UserRole);
            return user;
        }

        private async Task EnsureRole(AppUser user, string role)
        {
            if (roleManager == null)
            {
                throw new Exception("roleManager null");
            }

            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }

            await userManager.AddToRoleAsync(user, role);
        }
    }
}
