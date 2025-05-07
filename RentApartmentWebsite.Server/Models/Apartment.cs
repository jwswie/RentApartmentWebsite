namespace RentApartmentWebsite.Server.Models
{
    public class Apartment
    {
        public int ApartmentID { get; set; }
        public string? ApartmentName { get; set; }
        public double ApartmentPrice { get; set; } = 0.0;
        public string? ApartmentLocation { get; set; }
        public string? ApartmentCountry { get; set; }
        public double ApartmentRate { get; set; } = 0.0;
        public string? ApartmentPhoto { get; set; }
    }
}