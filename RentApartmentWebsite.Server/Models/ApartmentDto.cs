namespace RentApartmentWebsite.Server.Models
{
    public class ApartmentDto
    {
        public int ApartmentID { get; set; }
        public string ApartmentName { get; set; } = "";
        public double ApartmentPrice { get; set; }
        public string ApartmentLocation { get; set; } = "";
        public string ApartmentCountry { get; set; } = "";
        public double ApartmentRate { get; set; }
        public string ApartmentPhoto { get; set; } = "";
        public int ApartmentArea { get; set; }
        public int ApartmentCapacity { get; set; }
        public string AllowedEvents { get; set; } = "";
        public string AllowedChildren { get; set; } = "";
        public string AllowedPets { get; set; } = "";
        public string AllowedSmoking { get; set; } = "";
        public int Bedroom { get; set; }
        public int Bathroom { get; set; }
        public List<string> Categories { get; set; } = new();
        public List<InfrastructureDto> Infrastructures { get; set; } = new();
        public List<string> Amenities { get; set; } = new();
    }
}