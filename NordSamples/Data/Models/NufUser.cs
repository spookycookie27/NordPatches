﻿using System.ComponentModel.DataAnnotations;

namespace NordSamples.Data.Models
{
    public class NufUser
    {
        public int Id { get; set; }

        [MaxLength(255)]
        public string Username { get; set; }

        [MaxLength(6)]
        public string ActivationCode { get; set; }
    }
}
