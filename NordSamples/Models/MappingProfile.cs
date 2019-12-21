using AutoMapper;
using NordSamples.Data.Models;
using NordSamples.Models.ViewModels;

namespace NordSamples.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AppUser, UserViewModel>();

            CreateMap<Data.Models.Patch, ViewModels.Patch>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.NufUser));
            CreateMap<ViewModels.Patch, Data.Models.Patch>()
                .ForMember(dest => dest.AppUserId, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.NufUserId, opt => opt.MapFrom(src => src.User.NufUserId));
            CreateMap<Data.Models.File, ViewModels.File>();
            CreateMap<NufUser, User>()
                .ForMember(dest => dest.NufUserId, opt => opt.MapFrom(src => src.Id));
            CreateMap<AppUser, User>();
            CreateMap<Data.Models.PatchFile, ViewModels.PatchFile>();
            CreateMap<Data.Models.Instrument, ViewModels.Instrument>();
            CreateMap<Data.Models.Category, ViewModels.Category>();
            CreateMap<Data.Models.Tag, ViewModels.Tag>();
            CreateMap<ViewModels.Tag, Data.Models.Tag>();
            CreateMap<Data.Models.Comment, ViewModels.Comment>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.AppUser));
        }
    }
}