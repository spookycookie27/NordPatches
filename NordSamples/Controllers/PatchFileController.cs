using System;
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
        private readonly IAppCache cache;
        private readonly ILogger<PatchFileController> logger;

        public PatchFileController(ApplicationDbContext context, IMapper mapper, IAppCache cache, ILogger<PatchFileController> logger)
        {
            this.context = context;
            this.mapper = mapper;
            this.cache = cache;
            this.logger = logger;
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Patch>> Post([FromBody] PatchFile patchFile)
        {
            try
            {
                Data.Models.Patch existingPatch = await context.Patches
                    .Include(x => x.Tags)
                    .Include(x => x.Ratings)
                    .Include(x => x.AppUser)
                    .Include(x => x.NufUser)
                    .Include(x => x.PatchFiles)
                        .ThenInclude(pf => pf.File)
                    .OrderByDescending(x => x.DateCreated)
                    .SingleOrDefaultAsync(x => x.Id == patchFile.PatchId);


                existingPatch.PatchFiles.Add(new Data.Models.PatchFile { FileId = patchFile.FileId, PatchId = patchFile.PatchId });
                await context.SaveChangesAsync();

                cache.Remove(Constants.PatchCacheKey);
                cache.Remove(Constants.FileCacheKey);

                Data.Models.Patch updatedPatch = await context.Patches
                    .Include(x => x.Tags)
                    .Include(x => x.Ratings)
                    .Include(x => x.AppUser)
                    .Include(x => x.NufUser)
                    .Include(x => x.PatchFiles)
                    .ThenInclude(pf => pf.File)
                    .OrderByDescending(x => x.DateCreated)
                    .SingleOrDefaultAsync(x => x.Id == patchFile.PatchId);

                var model = mapper.Map<Patch>(updatedPatch);
                return CreatedAtAction("Post", model);
            }
            catch (Exception e)
            {
                logger.LogError(e, "An error occurred creating the DB connection.");
                return BadRequest();
            }
        }

        [HttpDelete("{fileId}/{id}")]
        [Authorize(Policy = "HasPatchEditAuthorization")]
        public async Task<ActionResult<Patch>> Delete([FromRoute] int fileId, [FromRoute] int id)
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
                .FirstOrDefaultAsync(x => x.Id == id);

            var patchFile = existingPatch.PatchFiles.SingleOrDefault(x => x.FileId == fileId);
            existingPatch.PatchFiles.Remove(patchFile);
            await context.SaveChangesAsync();

            cache.Remove(Constants.PatchCacheKey);
            cache.Remove(Constants.FileCacheKey);

            var model = mapper.Map<Patch>(existingPatch);
            return model;
        }
    }
}
