namespace RentApartmentWebsite.Server.Models
{
    public class Booking
    {
        public int BookingID { get; set; }
        public DateTime ArrivalDate { get; set; }
        public DateTime DepartureDate { get; set; }

        public int ApartmentID { get; set; }
        public Apartment? Apartment { get; set; }

        public int UserID { get; set; }
        public User? User { get; set; }
    }
}
