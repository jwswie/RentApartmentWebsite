using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RentApartmentWebsite.Server.Models
{
    public class ApartmentAmenity
    {
        [Key]
        public int AmenityID { get; set; }

        [Required]
        [MaxLength(255)]
        public string AmenityName { get; set; } = string.Empty;

        [ForeignKey(nameof(Apartment))]
        public int ApartmentID { get; set; }

        public Apartment? Apartment { get; set; }
    }
}