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
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => GetUser(src)));
            CreateMap<Patch, Data.Models.Patch>()
                .ForMember(dest => dest.AppUserId, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.NufUserId, opt => opt.MapFrom(src => src.User.NufUserId));
            CreateMap<Data.Models.File, File>();
            CreateMap<NufUser, User>()
                .ForMember(dest => dest.NufUserId, opt => opt.MapFrom(src => src.Id));
            CreateMap<AppUser, User>();
            CreateMap<Data.Models.PatchFile, PatchFile>();
            CreateMap<Data.Models.Instrument, Instrument>();
            CreateMap<Data.Models.Rating, Rating>();
            CreateMap<Data.Models.Category, Category>();
            CreateMap<Data.Models.Tag, Tag>();
            CreateMap<Tag, Data.Models.Tag>();
            CreateMap<Data.Models.Comment, Comment>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.AppUser));
        }

        private static User GetUser(Data.Models.Patch src)
        {
            var user = new User();

            if (src.AppUser != null)
            {
                user.Id = src.AppUser.Id;
                user.NufUserId = src.AppUser.NufUserId.ToString();
                user.Username = src.AppUser.UserName;
            }
            else if (src.NufUser != null)
            {
                user.NufUserId = src.NufUser.Id.ToString();
                user.Username = src.NufUser.Username;
            }
            else
            {
                user = null;
            }

            return user;
        }
    }
}