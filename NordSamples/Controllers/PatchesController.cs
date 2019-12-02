using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public PatchesController(ApplicationDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        // GET: api/Patches
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<Patch>>> GetPatches()
        {
            var patches = await context.Patches
                .Include(x => x.Files)
                .Include(x => x.NufUser)
                .Include(x => x.Instrument)
                .Include(x => x.Category)
                .Include(x => x.Tags)
                .Include(x => x.Comments)
                .AsNoTracking()
                .ToListAsync();

            var model = mapper.Map<List<Patch>>(patches);
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

        private bool PatchExists(int id)
        {
            return context.Patches.Any(e => e.Id == id);
        }
    }
}
