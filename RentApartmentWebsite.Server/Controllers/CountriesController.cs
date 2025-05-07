using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace RentApartmentWebsite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountriesController : Controller
    {
        private readonly ApplicationDbContext _context;
        public CountriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCountries()
        {
            var countries = _context.Countries.ToList();
            return Ok(countries);
        }
    }
}