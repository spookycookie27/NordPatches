using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LazyCache;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NordSamples.Data;
using NordSamples.Models;
using Patch = NordSamples.Models.Patch;

namespace NordSamples.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatchFileController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly ILogger<PatchController> logger;
        private readonly IAppCache cache;

        public PatchFileController(ApplicationDbContext context, IMapper mapper, ILogger<PatchController> logger, IAppCache cache)
        {
            this.context = context;
            this.mapper = mapper;
            this.logger = logger;
            this.cache = cache;
        }

        [HttpDelete("{fileId}/{patchId}")]
        [Authorize(Policy = "HasPatchEditAuthorization")]
        public async Task<ActionResult<Patch>> Delete([FromRoute] int fileId, [FromRoute] int patchId)
        {
            Data.Models.Patch existingPatch = await context.Patches
                .Include(x => x.NufUser)
                .Include(x => x.Tags)
                .Include(x => x.Ratings)
                .Include(x => x.Comments)
                .Include(x => x.Children)
                    .ThenInclude(x => x.PatchFiles)
                        .ThenInclude(pf => pf.File)
                .Include(x => x.Children)
                    .ThenInclude(x => x.NufUser)
                .Include(x => x.Parent)
                    .ThenInclude(x => x.PatchFiles)
                        .ThenInclude(pf => pf.File)
                .Include(x => x.Parent)
                    .ThenInclude(x => x.NufUser)
                .Include(x => x.PatchFiles)
                    .ThenInclude(pf => pf.File)
                .FirstOrDefaultAsync(x => x.Id == patchId);

            var patchFile = existingPatch.PatchFiles.SingleOrDefault(x => x.FileId == fileId);
            existingPatch.PatchFiles.Remove(patchFile);
            await context.SaveChangesAsync();
            var model = mapper.Map<Patch>(existingPatch);
            return model;
        }

        private bool PatchExists(int id)
        {
            return context.Patches.Any(e => e.Id == id);
        }
    }
}
