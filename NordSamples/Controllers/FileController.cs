using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using LazyCache;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using NordSamples.Data;
using NordSamples.Models;

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
        private readonly string storageConnectionString;

        private const int MaxLength = 20000000;  //20mb set in from end

        public FileController(ApplicationDbContext context, IMapper mapper, ILogger<FileController> logger, IAppCache cache, IConfiguration configuration)
        {
            this.context = context;
            this.mapper = mapper;
            this.logger = logger;
            this.cache = cache;
            this.storageConnectionString = configuration["StorageConnectionString"];
        }

        // POST: api/File
        [HttpPost("{id}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult<Patch>> PostFile([FromRoute] int id, IFormCollection collection)
        {
            IFormFile file = collection.Files[0];
            string comment = collection["Comment"].ToString();
            string appUserId = collection["AppUserId"].ToString();
            _ = int.TryParse(collection["NufUserId"].ToString(), out int nufUserId);
            string extension = collection["Extension"].ToString();
            if (file.Length > MaxLength)
            {
                return BadRequest("file size too big");
            }

            CloudBlockBlob blob = await SaveFileToBlob(file, "mp3s", id);
            var newFile = new Data.Models.File
            {
                Name = blob.Name,
                Comment = comment,
                DateCreated = DateTime.UtcNow,
                AppUserId = appUserId,
                NufUserId = nufUserId,
                IsBlob = true,
                Extension = extension,
                Size = (int)blob.Properties.Length,
                PatchFiles = new List<Data.Models.PatchFile>()
            };
            var newPatchFile = new Data.Models.PatchFile { PatchId = id };
            newFile.PatchFiles.Add(newPatchFile);

            context.Files.Add(newFile);
            await context.SaveChangesAsync();

            cache.Remove(Constants.PatchCacheKey);

            var returnFile = mapper.Map<File>(newFile);
            return CreatedAtAction("PostFile", returnFile);
        }

        // PUT: api/File
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult<Patch>> PutFile([FromRoute] int id, [FromBody] File file)
        {
            Data.Models.File fileToUpdate = await context.Files.SingleAsync(x => x.Id == id);
            fileToUpdate.Removed = file.Removed;
            await context.SaveChangesAsync();

            cache.Remove(Constants.PatchCacheKey);

            return Ok();
        }

        // GET: api/File
        [HttpGet]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult<List<File>>> GetFiles()
        {
            List<File> model;
            try
            {
                async Task<List<Data.Models.File>> FileGetter() =>
                    await context.Files
                        .Include(x => x.NufUser)
                        .Include(pf => pf.PatchFiles)
                        .Include(u => u.AppUser)
                        .Include(n => n.NufUser)
                     .AsNoTracking()
                     .ToListAsync();

                List<Data.Models.File> cachedFiles = await cache.GetOrAddAsync(Constants.FileCacheKey, FileGetter);

                model = mapper.Map<List<File>>(cachedFiles);

            }
            catch (Exception e)
            {
                logger.LogError(e, "An error occurred connecting to the DB.");
                model = null;
            }
            return model;
        }

        private async Task<CloudBlockBlob> SaveFileToBlob(IFormFile file, string containerName, int patchId)
        {
            if (string.IsNullOrEmpty(file.FileName))
            {
                return null;
            }

            string name = $"patch_{patchId}_{file.FileName}";
            try
            {
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer container = blobClient.GetContainerReference(containerName);
                CloudBlockBlob blockBlob = container.GetBlockBlobReference(name);
                await blockBlob.UploadFromStreamAsync(file.OpenReadStream());
                return blockBlob;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
