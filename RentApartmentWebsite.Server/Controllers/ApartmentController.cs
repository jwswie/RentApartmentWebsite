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
                .Include(a => a.Amenities)
                .Select(a => new ApartmentDto
                {
                    ApartmentID = a.ApartmentID,
                    ApartmentName = a.ApartmentName,
                    ApartmentPrice = a.ApartmentPrice,
                    ApartmentLocation = a.ApartmentLocation,
                    ApartmentCountry = a.ApartmentCountry,
                    ApartmentRate = a.ApartmentRate,
                    ApartmentPhoto = a.ApartmentPhoto,
                    ApartmentArea = a.ApartmentArea,
                    ApartmentCapacity = a.ApartmentCapacity,
                    Bedroom = a.Bedroom,
                    Bathroom = a.Bathroom,
                    AllowedEvents = a.AllowedEvents,
                    AllowedChildren = a.AllowedChildren,
                    AllowedPets = a.AllowedPets,
                    AllowedSmoking = a.AllowedSmoking,
                    Categories = a.Categories.Select(c => c.CategoryName).ToList(),
                    Infrastructures = a.Infrastructures.Select(i => new InfrastructureDto
                    {
                        InfrastructureName = i.InfrastructureName,
                        InfrastructureDistance = i.InfrastructureDistance,
                        MeasureUnit = i.MeasureUnit
                    }).ToList(),
                    Amenities = a.Amenities.Select(c => c.AmenityName).ToList()
                })
                .ToList();

            return Ok(apartments);
        }

        [HttpGet("{id}")]
        public IActionResult GetApartmentById(int id)
        {
            var apartment = _context.Apartments
                .Include(a => a.Categories)
                .Include(a => a.Amenities)
                .FirstOrDefault(a => a.ApartmentID == id);

            if (apartment == null)
                return NotFound();

            var result = new ApartmentDto
            {
                ApartmentID = apartment.ApartmentID,
                ApartmentName = apartment.ApartmentName,
                ApartmentPrice = apartment.ApartmentPrice,
                ApartmentLocation = apartment.ApartmentLocation,
                ApartmentCountry = apartment.ApartmentCountry,
                ApartmentRate = apartment.ApartmentRate,
                ApartmentPhoto = apartment.ApartmentPhoto,
                ApartmentArea = apartment.ApartmentArea,
                ApartmentCapacity = apartment.ApartmentCapacity,
                Bedroom = apartment.Bedroom,
                Bathroom = apartment.Bathroom,
                AllowedEvents = apartment.AllowedEvents,
                AllowedChildren = apartment.AllowedChildren,
                AllowedPets = apartment.AllowedPets,
                AllowedSmoking = apartment.AllowedSmoking,
                Categories = apartment.Categories.Select(c => c.CategoryName).ToList(),
                Infrastructures = apartment.Infrastructures.Select(i => new InfrastructureDto
                {
                    InfrastructureName = i.InfrastructureName,
                    InfrastructureDistance = i.InfrastructureDistance,
                    MeasureUnit = i.MeasureUnit
                }).ToList(),
                Amenities = apartment.Amenities.Select(a => a.AmenityName).ToList()
            };

            return Ok(result);
        }

    }
}