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
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Identity.UI.Services;
using System.Text.Encodings.Web;
using System.Threading;

namespace NordSamples.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly JwtOptions _jwtOptions;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;
        public IList<AuthenticationScheme> ExternalLogins { get; set; }
        public AuthController(UserManager<IdentityUser> userManager, IOptions<JwtOptions> jwtOptions, SignInManager<IdentityUser> signInManager, IMapper mapper, IEmailSender emailSender)
        {
            _userManager = userManager;
            _jwtOptions = jwtOptions.Value;
            _signInManager = signInManager;
            _mapper = mapper;
            _emailSender = emailSender;
        }

        // POST: api/Auth/Register
        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
            if (ModelState.IsValid)
            {
                var user = new IdentityUser { UserName = model.Email, Email = model.Email };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    //_logger.LogInformation("User created a new account with password.");
                    await _userManager.AddToRoleAsync(user, Constants.UserRole);
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

                    var callbackUrl = Url.Action("ConfirmEmail", "Auth", new { userId = user.Id, code = code }, Request.Scheme);

                    await _emailSender.SendEmailAsync(model.Email, "Confirm your email",
                        $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

                    if (!_userManager.Options.SignIn.RequireConfirmedAccount)
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                    }
                    return Ok();
                }
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
                return RedirectToPage("/Index");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{userId}'.");
            }

            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
            var result = await _userManager.ConfirmEmailAsync(user, code);
            string url = result.Succeeded ? "/login" : "/error";
            return Redirect(url);
        }

        // POST: api/Auth/Login
        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Login(LoginModel login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, set lockoutOnFailure: true
            var result = await _signInManager.PasswordSignInAsync(login.Email, login.Password, login.RememberMe, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var appUser = await _userManager.FindByEmailAsync(login.Email);

                if (appUser == null) return Unauthorized();

                var roles = await _userManager.GetRolesAsync(appUser);
                var isAdmin = roles.Contains(Constants.AdministratorRole);
                var roleToUse = isAdmin ? Constants.AdministratorRole : Constants.UserRole;

                var tokenExpiry = DateTime.Now.AddMinutes(1);

                var claims = new[] {
                    new Claim(ClaimTypes.Name, appUser.Email),
                    new Claim(JwtRegisteredClaimNames.Sub, appUser.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Exp, $"{new DateTimeOffset(tokenExpiry).ToUnixTimeSeconds()}"),
                    new Claim(JwtRegisteredClaimNames.Nbf, $"{new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds()}") ,
                    new Claim(ClaimTypes.Role, roleToUse),
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    _jwtOptions.Issuer,
                    _jwtOptions.Issuer,
                    claims,
                    expires: tokenExpiry,
                    signingCredentials: creds);

                var user = _mapper.Map<UserViewModel>(appUser);
                user.Role = roleToUse;


                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), user, tokenExpiry });
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordModel login)
        {
            var user = await _userManager.FindByEmailAsync(login.Email);
            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            {
                // Don't reveal that the user does not exist or is not confirmed
                return RedirectToPage("./ForgotPasswordConfirmation");
            }

            // For more information on how to enable account confirmation and password reset please 
            // visit https://go.microsoft.com/fwlink/?LinkID=532713
            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encoded = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            var callbackUrl = Url.Action("ResetPassword", "Auth", new { code = encoded }, Request.Scheme);


            await _emailSender.SendEmailAsync(
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

            var decoded = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Code));

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToPage("/ResetPasswordConfirmation");
            }

            var result = await _userManager.ResetPasswordAsync(user, decoded, model.Password);

            if (result.Succeeded)
            {
                return Ok();
            }

            foreach (var error in result.Errors)
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
            var email = jwtHandler.ReadJwtToken(data.Token).Subject;
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) return NotFound();

            var returnUser = _mapper.Map<UserViewModel>(user);

            return Ok(returnUser);
        }
    }
}
