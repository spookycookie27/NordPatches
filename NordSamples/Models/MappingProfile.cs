using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace NordSamples.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<IdentityUser, UserViewModel>();
        }
    }
}