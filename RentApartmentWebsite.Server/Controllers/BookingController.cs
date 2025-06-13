using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentApartmentWebsite.Server.Models;

namespace RentApartmentWebsite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : Controller
    {
        private readonly ApplicationDbContext _context;
        public BookingController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult AddBooking([FromBody] Booking booking)
        {
            var isOverlap = _context.Bookings.Any(b =>
                b.ApartmentID == booking.ApartmentID &&
                ((booking.ArrivalDate >= b.ArrivalDate && booking.ArrivalDate < b.DepartureDate) ||
                 (booking.DepartureDate > b.ArrivalDate && booking.DepartureDate <= b.DepartureDate) ||
                 (booking.ArrivalDate <= b.ArrivalDate && booking.DepartureDate >= b.DepartureDate))
            );

            if (isOverlap)
            {
                return Conflict("Цей період уже заброньований.");
            }

            _context.Bookings.Add(booking);
            _context.SaveChanges();

            return Ok(new { message = "Бронювання успішно додано!" });
        }

    }
}