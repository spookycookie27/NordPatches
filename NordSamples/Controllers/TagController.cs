using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NordSamples.Data;
using NordSamples.Models;

namespace NordSamples.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly ILogger<FileController> logger;


        public TagController(ApplicationDbContext context, ILogger<FileController> logger)
        {
            this.context = context;
            this.logger = logger;
        }

        // GET: api/Tag
        [HttpGet]
        [AllowAnonymous]
        //[Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult<List<TagOption>>> GetTags()
        {
            List<TagOption> model;
            try
            {
                model = await context.Tags.Select(x => new TagOption { Name = x.Name }).Distinct().ToListAsync();
            }
            catch (Exception e)
            {
                logger.LogError(e, "An error occurred connecting to the DB.");
                model = null;
            }
            return model;
        }
    }
}
