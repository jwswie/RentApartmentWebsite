using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentApartmentWebsite.Server.Models;

namespace RentApartmentWebsite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApartmentController : Controller
    {
        private readonly ApplicationDbContext _context;
        public ApartmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetApartments()
        {
            var apartments = _context.Apartments
                .Include(a => a.Categories)
                .Select(a => new ApartmentDto
                {
                    ApartmentID = a.ApartmentID,
                    ApartmentName = a.ApartmentName,
                    ApartmentPrice = a.ApartmentPrice,
                    ApartmentLocation = a.ApartmentLocation,
                    ApartmentCountry = a.ApartmentCountry,
                    ApartmentRate = a.ApartmentRate,
                    ApartmentPhoto = a.ApartmentPhoto,
                    Categories = a.Categories.Select(c => c.CategoryName).ToList()
                })
                .ToList();

            return Ok(apartments);
        }

    }
}