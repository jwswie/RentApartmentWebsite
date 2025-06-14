namespace RentApartmentWebsite.Server.Models
{
    public class Review
    {
        public int ReviewID { get; set; }
        public int UserID { get; set; }
        public User User { get; set; }

        public DateTime ReviewDate { get; set; }

        public string ReviewText { get; set; }

        public int ReviewRate { get; set; }
        public int ApartmentID { get; set; }
        public Apartment Apartment { get; set; }
    }

}
