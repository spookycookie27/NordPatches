using System;
using System.Collections;
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
    public class PatchesController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly ILogger<PatchesController> logger;
        private readonly IAppCache cache;

        public PatchesController(ApplicationDbContext context, IMapper mapper, ILogger<PatchesController> logger, IAppCache cache)
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
                     .Include(x => x.NufUser)
                     .Include(x => x.Instrument)
                     .Include(x => x.Category)
                     .Include(x => x.Tags)
                     .Include(x => x.Comments)
                     .Include(x => x.Children)
                     .Include(x => x.Parent)
                     .Include(x => x.PatchFiles)
                        .ThenInclude(pf => pf.File)
                     .AsNoTracking()
                     .ToListAsync();

                List<Data.Models.Patch> cachedPatches = await cache.GetOrAddAsync("PatchesController.GetPatches", PatchGetter);

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
            var patch = await context.Patches.FindAsync(id);

            if (patch == null)
            {
                return NotFound();
            }

            var model = mapper.Map<Patch>(patch);
            return model;
        }

        // PUT: api/Patches/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        // [HttpPut("{id}")]
        // public async Task<IActionResult> PutPatch(int id, Patch patch)
        // {
        //     if (id != patch.Id)
        //     {
        //         return BadRequest();
        //     }

        //     context.Entry(patch).State = EntityState.Modified;

        //     try
        //     {
        //         await context.SaveChangesAsync();
        //     }
        //     catch (DbUpdateConcurrencyException)
        //     {
        //         if (!PatchExists(id))
        //         {
        //             return NotFound();
        //         }
        //         else
        //         {
        //             throw;
        //         }
        //     }

        //     return NoContent();
        // }

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

        //private bool PatchExists(int id)
        //{
        //    return context.Patches.Any(e => e.Id == id);
        //}
    }
}
