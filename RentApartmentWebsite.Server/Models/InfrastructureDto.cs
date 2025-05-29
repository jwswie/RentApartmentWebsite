namespace RentApartmentWebsite.Server.Models
{
    public class InfrastructureDto
    {
        public string InfrastructureName { get; set; } = string.Empty;
        public int? InfrastructureDistance { get; set; }
        public string MeasureUnit { get; set; } = string.Empty;
    }

}
