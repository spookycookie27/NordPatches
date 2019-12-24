using AutoMapper;
using NordSamples.Data.Models;

namespace NordSamples.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AppUser, UserViewModel>();

            CreateMap<Data.Models.Patch, Patch>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.NufUser));
            CreateMap<Patch, Data.Models.Patch>()
                .ForMember(dest => dest.AppUserId, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.NufUserId, opt => opt.MapFrom(src => src.User.NufUserId));
            CreateMap<Data.Models.File, File>();
            CreateMap<NufUser, User>()
                .ForMember(dest => dest.NufUserId, opt => opt.MapFrom(src => src.Id));
            CreateMap<AppUser, User>();
            CreateMap<Data.Models.PatchFile, PatchFile>();
            CreateMap<Data.Models.Instrument, Instrument>();
            CreateMap<Data.Models.Category, Category>();
            CreateMap<Data.Models.Tag, Tag>();
            CreateMap<Tag, Data.Models.Tag>();
            CreateMap<Data.Models.Comment, Comment>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.AppUser));
        }
    }
}