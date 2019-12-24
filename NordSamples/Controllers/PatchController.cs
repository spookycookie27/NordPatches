using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using LazyCache;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NordSamples.Data;
using NordSamples.Data.Constants;
using NordSamples.Models;

namespace NordSamples.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatchController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly ILogger<PatchController> logger;
        private readonly IAppCache cache;

        public PatchController(ApplicationDbContext context, IMapper mapper, ILogger<PatchController> logger, IAppCache cache)
        {
            this.context = context;
            this.mapper = mapper;
            this.logger = logger;
            this.cache = cache;
        }

        // GET: api/Patches
        [HttpGet]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult<List<Patch>>> GetPatches()
        {
            List<Patch> model;
            try
            {
                async Task<List<Data.Models.Patch>> PatchGetter() =>
                    await context.Patches
                     .Where(x => !x.Removed)
                     .Include(x => x.Tags)
                     .Include(x => x.PatchFiles)
                        .ThenInclude(pf => pf.File)
                     .AsNoTracking()
                     .ToListAsync();

                List<Data.Models.Patch> cachedPatches = await PatchGetter();
                //List<Data.Models.Patch> cachedPatches = await cache.GetOrAddAsync("PatchesController.GetPatches", PatchGetter);

                model = mapper.Map<List<Patch>>(cachedPatches);

            }
            catch (Exception e)
            {
                logger.LogError(e, "An error occurred creating the DB.");
                model = null;
            }
            return model;
        }

        // GET: api/Patches
        [HttpGet("user")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult<List<Patch>>> GetUserPatches()
        {
            List<Patch> model;
            bool isAuthorized;
            string appUserId;
            string primarySid;
            int? nufUserId;
            try
            {
                ClaimsPrincipal user = HttpContext.User;
                if (user.Identity.IsAuthenticated)
                {
                    isAuthorized = user.IsInRole(Constants.AdministratorRole) || user.IsInRole(Constants.UserRole);

                    appUserId = user.HasClaim(x => x.Type == ClaimTypes.Sid)
                        ? user.Claims.Where(x => x.Type == ClaimTypes.Sid).FirstOrDefault().Value
                        : null;
                    primarySid = user.HasClaim(x => x.Type == ClaimTypes.PrimarySid)
                        ? user.Claims.Where(x => x.Type == ClaimTypes.PrimarySid).FirstOrDefault().Value
                        : null;

                    nufUserId = primarySid != null
                        ? (int?)int.Parse(primarySid)
                        : null;
                }
                else
                {
                    return Unauthorized();
                }

                async Task<List<Data.Models.Patch>> PatchGetter() =>
                    await context.Patches
                     .Where(x => x.AppUserId == appUserId || (nufUserId != null && x.NufUserId == nufUserId))
                     .Include(x => x.Tags)
                     .Include(x => x.PatchFiles)
                        .ThenInclude(pf => pf.File)
                     .AsNoTracking()
                     .ToListAsync();

                List<Data.Models.Patch> cachedPatches = await PatchGetter();

                model = mapper.Map<List<Patch>>(cachedPatches);

            }
            catch (Exception e)
            {
                logger.LogError(e, "An error occurred creating the DB.");
                model = null;
            }
            return model;
        }

        // GET: api/Patches/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patch>> GetPatch(int id)
        {
            var patch = await context.Patches
                .Include(x => x.NufUser)
                .Include(x => x.Tags)
                .Include(x => x.Ratings)
                .Include(x => x.Comments)
                .Include(x => x.Children)
                    .ThenInclude(x => x.PatchFiles)
                        .ThenInclude(pf => pf.File)
                .Include(x => x.Parent)
                    .ThenInclude(x => x.PatchFiles)
                        .ThenInclude(pf => pf.File)
                .Include(x => x.PatchFiles)
                    .ThenInclude(pf => pf.File)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (patch == null)
            {
                return NotFound();
            }

            var model = mapper.Map<Patch>(patch);
            return model;
        }

        // POST: api/Patches
        [HttpPost]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult<Patch>> PostPatch(Patch patch)
        {
            var patchToInsert = mapper.Map<Data.Models.Patch>(patch);
            patchToInsert.DateCreated = DateTime.UtcNow;
            patchToInsert.Tags = new List<NordSamples.Data.Models.Tag>();
            foreach (var tag in patch.Tags)
            {
                patchToInsert.Tags.Add(new Data.Models.Tag { Name = tag.Name });
            }
            context.Patches.Add(patchToInsert);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetPatch", patchToInsert);
        }

        // PUT: api/Patches/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> PutPatch([FromRoute] int id, [FromBody] Patch patch)
        {
            if (!PatchExists(id))
            {
                return NotFound();
            }
            patch.DateUpdated = DateTime.UtcNow;
            var exisitingPatch = context.Patches.Where(x => x.Id == id).Include(x => x.Tags).SingleOrDefault();
            context.Entry(exisitingPatch).CurrentValues.SetValues(patch);
            UpdateTags(id, patch, exisitingPatch);

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatchExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private void UpdateTags(int id, Patch patch, Data.Models.Patch exisitingPatch)
        {
            var tagsToRemove = new List<NordSamples.Data.Models.Tag>();
            var tagsToAdd = new List<NordSamples.Data.Models.Tag>();
            foreach (var tag in exisitingPatch.Tags)
            {
                if (!patch.Tags.Any(x => x.Name == tag.Name && x.PatchId == id))
                {
                    tagsToRemove.Add(tag);
                }
            }
            foreach (var tag in patch.Tags)
            {
                if (!exisitingPatch.Tags.Any(x => x.Name == tag.Name && x.PatchId == id))
                {
                    var newTag = new NordSamples.Data.Models.Tag { PatchId = id, Name = tag.Name };
                    tagsToAdd.Add(newTag);
                }
            }
            context.Tags.AddRange(tagsToAdd);
            context.Tags.RemoveRange(tagsToRemove);
        }

        private void InsertTags(Patch patch, Data.Models.Patch patchToInsert)
        {
            var tagsToAdd = new List<NordSamples.Data.Models.Tag>();
            foreach (var tag in patch.Tags)
            {
                var newTag = new NordSamples.Data.Models.Tag { Name = tag.Name, Patch = patchToInsert };
                tagsToAdd.Add(newTag);
            }
            context.Tags.AddRange(tagsToAdd);
        }

        private bool PatchExists(int id)
        {
            return context.Patches.Any(e => e.Id == id);
        }

        // DELETE: api/Patches/5
        // [HttpDelete("{id}")]
        // public async Task<ActionResult<Patch>> DeletePatch(int id)
        // {
        //     Patch patch = await context.Patches.FindAsync(id);
        //     if (patch == null)
        //     {
        //         return NotFound();
        //     }

        //     context.Patches.Remove(patch);
        //     await context.SaveChangesAsync();

        //     return patch;
        // }
    }
}
