using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NordSamples.Data.Models
{
    public class PatchFile
    {
        public int PatchId { get; set; }
        public Patch Patch { get; set; }

        public int FileId { get; set; }
        public File File { get; set; }
    }
}
