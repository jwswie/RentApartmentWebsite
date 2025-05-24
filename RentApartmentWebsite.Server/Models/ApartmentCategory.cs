using System.ComponentModel.DataAnnotations;

namespace RentApartmentWebsite.Server.Models
{
    public class ApartmentCategory
    {
        [Key]
        public int CategoryID { get; set; }

        public string CategoryName { get; set; } = string.Empty;

        public int ApartmentID { get; set; }

        public Apartment? Apartment { get; set; }
    }
}