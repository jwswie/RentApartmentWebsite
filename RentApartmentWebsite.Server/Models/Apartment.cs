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
    }
}