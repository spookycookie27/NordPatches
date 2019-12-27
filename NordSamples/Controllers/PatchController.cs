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
using NordSamples.Data.Models;
using Patch = NordSamples.Models.Patch;
using Tag = NordSamples.Data.Models.Tag;

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
            int? nufUserId;
            try
            {
                ClaimsPrincipal user = HttpContext.User;
                string appUserId = user.Claims.Single(x => x.Type == ClaimTypes.Sid).Value;
                string primarySid = user.Claims.Single(x => x.Type == ClaimTypes.PrimarySid).Value;

                nufUserId = primarySid != null
                    ? (int?)int.Parse(primarySid)
                    : null;

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
            patchToInsert.Tags = new List<Tag>();
            foreach (var tag in patch.Tags)
            {
                patchToInsert.Tags.Add(new Data.Models.Tag { Name = tag.Name });
            }
            context.Patches.Add(patchToInsert);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetPatch", patchToInsert);
        }

        [HttpPost("rating/{id}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult<Patch>> RatePatch([FromBody] int rating, [FromRoute] int id)
        {
            ClaimsPrincipal user = HttpContext.User;
            string appUserId = user.Claims.Single(x => x.Type == ClaimTypes.Sid).Value;

            bool exists = context.Ratings.Any(x => x.AppUserId == appUserId && x.PatchId == id);
            if (exists)
            {
                Rating existingRating = context.Ratings.Single(x => x.AppUserId == appUserId && x.PatchId == id);
                existingRating.Value = rating;

            }
            else
            {
                var newRating = new Rating { AppUserId = appUserId, PatchId = id, Value = rating };
                context.Ratings.Add(newRating);
            }

            await context.SaveChangesAsync();

            return Ok();
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
            Data.Models.Patch existingPatch = context.Patches.Where(x => x.Id == id).Include(x => x.Tags).Single();
            context.Entry(existingPatch).CurrentValues.SetValues(patch);
            UpdateTags(id, patch, existingPatch);

            await context.SaveChangesAsync();

            return NoContent();
        }

        private void UpdateTags(int id, Patch patch, Data.Models.Patch existingPatch)
        {
            List<Tag> tagsToRemove = existingPatch.Tags.Where(tag => !patch.Tags.Any(x => x.Name == tag.Name && x.PatchId == id)).ToList();
            List<Tag> tagsToAdd = (
                from tag in patch.Tags
                where !existingPatch.Tags.Any(x => x.Name == tag.Name && x.PatchId == id)
                select new Tag
                {
                    PatchId = id,
                    Name = tag.Name
                }).ToList();

            context.Tags.AddRange(tagsToAdd);
            context.Tags.RemoveRange(tagsToRemove);
        }

        private bool PatchExists(int id)
        {
            return context.Patches.Any(e => e.Id == id);
        }
    }
}
