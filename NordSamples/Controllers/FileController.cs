using System;
using System.Collections.Generic;
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
    public class FileController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly ILogger<FileController> logger;
        private readonly IAppCache cache;

        public FileController(ApplicationDbContext context, IMapper mapper, ILogger<FileController> logger, IAppCache cache)
        {
            this.context = context;
            this.mapper = mapper;
            this.logger = logger;
            this.cache = cache;
        }

        // GET: api/Patches
        [HttpGet]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult<List<File>>> GetFiles()
        {
            List<File> model;
            try
            {
                async Task<List<Data.Models.File>> PatchGetter() =>
                    await context.Files
                        .Include(x => x.NufUser)
                        .Include(x => x.PatchFiles)
                        .ThenInclude(pf => pf.Patch)
                     .AsNoTracking()
                     .ToListAsync();

                List<Data.Models.File> cachedFiles = await cache.GetOrAddAsync("FileController.GetFiles", PatchGetter);

                model = mapper.Map<List<File>>(cachedFiles);

            }
            catch (Exception e)
            {
                logger.LogError(e, "An error occurred creating the DB.");
                model = null;
            }
            return model;
        }
    }
}
