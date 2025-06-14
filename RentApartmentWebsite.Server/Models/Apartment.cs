using System.ComponentModel.DataAnnotations;

namespace RentApartmentWebsite.Server.Models
{
    public class Apartment
    {
        public int ApartmentID { get; set; }

        [Required]
        [MaxLength(255)]
        public string ApartmentName { get; set; }
        public double ApartmentPrice { get; set; } = 0.0;

        [Required]
        [MaxLength(255)]
        public string ApartmentLocation { get; set; }

        [Required]
        [MaxLength(255)]
        public string ApartmentCountry { get; set; }

        public double ApartmentRate { get; set; } = 0.0;

        [Required]
        [MaxLength(255)]
        public string ApartmentPhoto { get; set; }

        [Required]
        public int ApartmentArea { get; set; }

        [Required]
        public int ApartmentCapacity { get; set; }

        [Required]
        public int Bedroom { get; set; }

        [Required]
        public int Bathroom { get; set; }

        [Required]
        [MaxLength(255)]
        public string AllowedEvents { get; set; }

        [Required]
        [MaxLength(255)]
        public string AllowedChildren { get; set; }

        [Required]
        [MaxLength(255)]
        public string AllowedPets { get; set; }

        [Required]
        [MaxLength(255)]
        public string AllowedSmoking { get; set; }

        [Required]
        public int OwnerID { get; set; }

        public ICollection<ApartmentInfrastructure> Infrastructures { get; set; } = new List<ApartmentInfrastructure>();
        public ICollection<ApartmentCategory> Categories { get; set; } = new List<ApartmentCategory>();
        public ICollection<ApartmentAmenity> Amenities { get; set; } = new List<ApartmentAmenity>();

        public ICollection<Booking> Bookngs { get; set; } = new List<Booking>();
        public ICollection<Review> Revies { get; set; } = new List<Review>();
    }
}