using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var apartments = _context.Apartments.ToList();
            return Ok(apartments);
        }
    }
}