using AutoMapper;
using Microsoft.AspNetCore.Identity;
using NordSamples.Data;
using NordSamples.Data.Models;

namespace NordSamples.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AppUser, UserViewModel>();
        }
    }
}