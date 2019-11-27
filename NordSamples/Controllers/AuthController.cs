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

        public AuthController(UserManager<IdentityUser> userManager, IOptions<JwtOptions> jwtOptions, SignInManager<IdentityUser> signInManager, IMapper mapper)
        {
            _userManager = userManager;
            _jwtOptions = jwtOptions.Value;
            _signInManager = signInManager;
            _mapper = mapper;
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
