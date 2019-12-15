using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LazyCache;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NordSamples.Data;
using NordSamples.Models.ViewModels;

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
        public async Task<ActionResult<List<Models.ViewModels.Patch>>> GetPatches()
        {
            List<Models.ViewModels.Patch> model;
            try
            {
                async Task<List<Data.Models.Patch>> PatchGetter() =>
                    await context.Patches
                     .Include(x => x.Tags)
                     .Include(x => x.PatchFiles)
                        .ThenInclude(pf => pf.File)
                     .AsNoTracking()
                     .ToListAsync();

                List<Data.Models.Patch> cachedPatches = await PatchGetter();
                //List<Data.Models.Patch> cachedPatches = await cache.GetOrAddAsync("PatchesController.GetPatches", PatchGetter);

                model = mapper.Map<List<Models.ViewModels.Patch>>(cachedPatches);

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
        public async Task<ActionResult<Models.ViewModels.Patch>> GetPatch(int id)
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

            var model = mapper.Map<Models.ViewModels.Patch>(patch);
            return model;
        }

        // PUT: api/Patches/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatch([FromRoute] int id, [FromBody] Patch patch)
        {
            if (!PatchExists(id))
            {
                return NotFound();
            }

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

        private bool PatchExists(int id)
        {
            return context.Patches.Any(e => e.Id == id);
        }

        // POST: api/Patches
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        // [HttpPost]
        // public async Task<ActionResult<Patch>> PostPatch(Patch patch)
        // {
        //     context.Patches.Add(patch);
        //     await context.SaveChangesAsync();

        //     return CreatedAtAction("GetPatch", new { id = patch.Id }, patch);
        // }

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
