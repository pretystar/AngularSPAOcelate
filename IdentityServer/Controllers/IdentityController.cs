﻿using AngularSPAWebAPI.Models;
using AngularSPAWebAPI.Models.AccountViewModels;
using AngularSPAWebAPI.Services;
using IdentityModel;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;

namespace AngularSPAWebAPI.Controllers
{
    /// <summary>
    /// Identity Web API controller.
    /// </summary>
    [Route("api/[controller]")]
    // Authorization policy for this API.
    [Authorize(AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme, Policy = "Manage Accounts")]
    public class IdentityController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ILogger _logger;

        public IdentityController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ILogger<IdentityController> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _logger = logger;
        }

        /// <summary>
        /// Gets all the users.
        /// </summary>
        /// <returns>Returns all the users</returns>
        // GET api/identity/GetAll
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            _logger.LogWarning(new EventId(199,"GetAllIdentity"),"Get All started");
            var role = await _roleManager.FindByNameAsync("user");
            var users = await _userManager.GetUsersInRoleAsync(role.Name);
            var us =
                from u in users
                select new { u.UserName, u.GivenName, u.FamilyName, u.LockoutEnabled, u.EmailConfirmed };
            return new JsonResult(us);
        }
        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody]CreateViewModel model)
        {
            var user = await _userManager.FindByNameAsync(model.username);
            if (user == null)
            {
                return BadRequest("Invalid credentials");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.password, true);
            if (!result.Succeeded)
            {
                return BadRequest("Invalid credentials");
            }
            return new JsonResult(result);
        }
        /// <summary>
        /// Registers a new user.
        /// </summary>
        /// <returns>IdentityResult</returns>
        // POST: api/identity/Create
        [HttpPost("Create")]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromBody]CreateViewModel model)
        {
            var user = new ApplicationUser
            {
                GivenName = model.givenName,
                FamilyName = model.familyName,
                AccessFailedCount = 0,
                Email = model.username,
                EmailConfirmed = false,
                LockoutEnabled = true,
                NormalizedEmail = model.username.ToUpper(),
                NormalizedUserName = model.username.ToUpper(),
                TwoFactorEnabled = false,
                UserName = model.username
            };

            var result = await _userManager.CreateAsync(user, model.password);

            if (result.Succeeded)
            {
                await addToRole(model.username, "user");
                await addClaims(model.username);
            }

            return new JsonResult(result);
        }
        /// <summary>
        /// Update a new user.
        /// </summary>
        /// <returns>IdentityResult</returns>
        // POST: api/identity/Update
        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromBody]UpdateViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.username);
            if(user!=null)
            {
                user.GivenName = model.givenName;
                user.FamilyName = model.familyName;
                user.EmailConfirmed = model.EmailConfirmed;
                user.LockoutEnabled = model.LockoutEnabled;
            }

            var result = await _userManager.UpdateAsync(user);

            return new JsonResult(result);
        }
        /// <summary>
        /// Deletes a user.
        /// </summary>
        /// <returns>IdentityResult</returns>
        // POST: api/identity/Delete
        [HttpPost("Delete")]
        public async Task<IActionResult> Delete([FromBody]string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            var result = await _userManager.DeleteAsync(user);

            return new JsonResult(result);
        }

        private async Task addToRole(string userName, string roleName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            await _userManager.AddToRoleAsync(user, roleName);
        }

        private async Task addClaims(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            var claims = new List<Claim> {
                new Claim(type: JwtClaimTypes.GivenName, value: user.GivenName),
                new Claim(type: JwtClaimTypes.FamilyName, value: user.FamilyName),
            };
            await _userManager.AddClaimsAsync(user, claims);
        }
    }
}