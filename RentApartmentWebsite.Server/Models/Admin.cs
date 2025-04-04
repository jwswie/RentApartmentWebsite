using System.ComponentModel.DataAnnotations;

namespace RentApartmentWebsite.Server.Models
{
    public class Admin
    {
        [Key]
        public int AdminID { get; set; }
        public required string AdminName { get; set; }
        public required string HashedPassword { get; set; }
        public required string Salt { get; set; }
        public required string AdminLogin { get; set; }
    }
}
