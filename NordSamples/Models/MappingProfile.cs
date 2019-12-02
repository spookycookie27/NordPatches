using AutoMapper;
using NordSamples.Data.Models;

namespace NordSamples.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AppUser, UserViewModel>();
            CreateMap<NordSamples.Data.Models.Patch, NordSamples.Models.ViewModels.Patch>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.NufUser))
                .ForMember(dest => dest.ParentId, opt => opt.MapFrom(src => src.PatchId))
                .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Parent));
            CreateMap<NordSamples.Data.Models.NufUser, NordSamples.Models.ViewModels.User>();
            CreateMap<NordSamples.Data.Models.AppUser, NordSamples.Models.ViewModels.User>();
            CreateMap<NordSamples.Data.Models.File, NordSamples.Models.ViewModels.File>();
            CreateMap<NordSamples.Data.Models.Instrument, NordSamples.Models.ViewModels.Instrument>();
            CreateMap<NordSamples.Data.Models.Category, NordSamples.Models.ViewModels.Category>();
            CreateMap<NordSamples.Data.Models.Tag, NordSamples.Models.ViewModels.Tag>();
            CreateMap<NordSamples.Data.Models.Comment, NordSamples.Models.ViewModels.Comment>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.AppUser));
        }
    }
}