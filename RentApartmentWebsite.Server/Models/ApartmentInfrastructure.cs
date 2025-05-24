using System.ComponentModel.DataAnnotations;

namespace RentApartmentWebsite.Server.Models
{
    public class ApartmentInfrastructure
    {
        [Key]
        public int InfrastructureID { get; set; }

        public string InfrastructureName { get; set; } = string.Empty;

        public int? InfrastructureDistance { get; set; }

        public string MeasureUnit { get; set; } = string.Empty;

        public int ApartmentID { get; set; }

        public Apartment? Apartment { get; set; }
    }
}