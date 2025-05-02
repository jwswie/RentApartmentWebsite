namespace RentApartmentWebsite.Server.Models
{
    public class UserDto // Data Transfer Object, чтобы передать клиенту фото в формате Base64
    {
        public int UserID { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        public string EmailAddress { get; set; } = string.Empty;
        public string? PhotoBase64 { get; set; }
    }

}