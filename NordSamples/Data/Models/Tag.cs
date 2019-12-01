using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NordSamples.Data.Models
{
    public class Tag
    {
        public int Id { get; set; }
        [MaxLength(255)]
        public string Name { get; set; }

        public int PatchId { get; set; }
        public Patch Patch { get; set; }
    }
}
