using System;

namespace NordSamples.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime DateCreated { get; set; }
        public string AppUserId { get; set; }

        public User User { get; set; }

    }
}
