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
        private readonly string storageConnectionString;

        private const int maxLength = 20000000;  //20mb set in from end

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
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<Patch>> PostFile([FromRoute] int id, IFormCollection collection)
        {
            var file = collection.Files[0];
            var comment = collection["Comment"].ToString();
            var appUserId = collection["AppUserId"].ToString();
            var nufUserId = int.Parse(collection["NufUserId"].ToString());
            var extension = collection["Extension"].ToString();
            if (file.Length > maxLength) return BadRequest("file size too big");
            CloudBlockBlob blob = await SaveFileToBlob(file, "mp3s", id);
            var newFile = new Data.Models.File
            {
                Name = blob.Name,
                Comment = comment,
                DateCreated = DateTime.Now,
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
            var returnFile = mapper.Map<File>(newFile);
            return CreatedAtAction("PostFile", returnFile);
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
                     .AsNoTracking()
                     .ToListAsync();

                List<Data.Models.File> cachedFiles = await cache.GetOrAddAsync("FileController.GetFiles", FileGetter);

                model = mapper.Map<List<File>>(cachedFiles);

            }
            catch (Exception e)
            {
                logger.LogError(e, "An error occurred creating the DB.");
                model = null;
            }
            return model;
        }

        private async Task<CloudBlockBlob> SaveFileToBlob(IFormFile file, string containerName, int patchId)
        {
            if (string.IsNullOrEmpty(file.FileName)) return null;
            var name = $"patch_{patchId}_{file.FileName}";
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
