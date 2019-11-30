using AutoMapper;
using Microsoft.AspNetCore.Identity;
using NordSamples.Data;

namespace NordSamples.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<NordAppUser, UserViewModel>();
        }
    }
}