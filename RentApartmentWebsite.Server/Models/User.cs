using System.ComponentModel.DataAnnotations;

namespace RentApartmentWebsite.Server.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }
        public required string UserName { get; set; }
        public required string EmailAddress { get; set; }
    }

}