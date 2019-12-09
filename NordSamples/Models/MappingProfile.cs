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
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.NufUser));
            CreateMap<NordSamples.Data.Models.File, NordSamples.Models.ViewModels.File>();
            CreateMap<NordSamples.Data.Models.NufUser, NordSamples.Models.ViewModels.User>()
                .ForMember(dest => dest.NufUserId, opt => opt.MapFrom(src => src.Id));

            CreateMap<NordSamples.Data.Models.AppUser, NordSamples.Models.ViewModels.User>();
            CreateMap<NordSamples.Data.Models.PatchFile, NordSamples.Models.ViewModels.PatchFile>();
            CreateMap<NordSamples.Data.Models.Instrument, NordSamples.Models.ViewModels.Instrument>();
            CreateMap<NordSamples.Data.Models.Category, NordSamples.Models.ViewModels.Category>();
            CreateMap<NordSamples.Data.Models.Tag, NordSamples.Models.ViewModels.Tag>();
            CreateMap<NordSamples.Data.Models.Comment, NordSamples.Models.ViewModels.Comment>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.AppUser));
        }
    }
}