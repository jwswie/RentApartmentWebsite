using System.ComponentModel.DataAnnotations;

namespace RentApartmentWebsite.Server.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [Required]
        public string UserName { get; set; } = string.Empty;

        public string? LastName { get; set; }

        [Required]
        [EmailAddress]
        public string EmailAddress { get; set; } = string.Empty;

        public byte[]? Photo { get; set; }

        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

        public double TrustRating { get; set; } = 0.0;

        [MaxLength(350)]
        public string? Biography { get; set; }

        public string? Location { get; set; }

        public string? University { get; set; }

        [MaxLength(30)]
        public string? Pets { get; set; }

        [MaxLength(30)]
        public string? DreamTrip { get; set; }

        [MaxLength(30)]
        public string? Profession { get; set; }

        [MaxLength(30)]
        public string? Hobby { get; set; }

        [MaxLength(30)]
        public string? BadHabits { get; set; }

        public ICollection<Booking> Bookngs { get; set; } = new List<Booking>();
        public ICollection<Review> Revies { get; set; } = new List<Review>();
    }
}