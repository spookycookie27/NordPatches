using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NordSamples.Data;
using NordSamples.Data.Models;

namespace NordSamples.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatchesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PatchesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Patches
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patch>>> GetPatches()
        {
            return await _context.Patches
                .Include(x => x.Files)
                .AsNoTracking()
                .ToListAsync();
        }

        // GET: api/Patches/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patch>> GetPatch(int id)
        {
            Patch patch = await _context.Patches.FindAsync(id);

            if (patch == null)
            {
                return NotFound();
            }

            return patch;
        }

        // PUT: api/Patches/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatch(int id, Patch patch)
        {
            if (id != patch.Id)
            {
                return BadRequest();
            }

            _context.Entry(patch).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
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

        // POST: api/Patches
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Patch>> PostPatch(Patch patch)
        {
            _context.Patches.Add(patch);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPatch", new { id = patch.Id }, patch);
        }

        // DELETE: api/Patches/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Patch>> DeletePatch(int id)
        {
            Patch patch = await _context.Patches.FindAsync(id);
            if (patch == null)
            {
                return NotFound();
            }

            _context.Patches.Remove(patch);
            await _context.SaveChangesAsync();

            return patch;
        }

        private bool PatchExists(int id)
        {
            return _context.Patches.Any(e => e.Id == id);
        }
    }
}
