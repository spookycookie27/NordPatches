namespace NordSamples.Models
{
    public class PatchFile
    {
        public int PatchId { get; set; }
        public Patch Patch { get; set; }

        public int FileId { get; set; }
        public File File { get; set; }
    }
}
