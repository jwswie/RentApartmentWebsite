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
        public List<string> Categories { get; set; } = new();
    }

}
