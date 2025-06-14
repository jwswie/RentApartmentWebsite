using RentApartmentWebsite.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;

namespace RentApartmentWebsite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetReviews()
        {
            var reviews = _context.Reviews.ToList();
            return Ok(reviews);
        }

        [HttpGet("apartment/{apartmentId}")]
        public async Task<IActionResult> GetReviewsForApartment(int apartmentId)
        {
            if (apartmentId <= 0)
                return BadRequest("Invalid apartment ID");

            var reviews = await _context.Reviews
                .Where(r => r.ApartmentID == apartmentId)
                .Select(r => new
                {
                    r.ReviewID,
                    r.ReviewText,
                    r.ReviewDate,
                    r.ReviewRate,
                    r.ApartmentID,
                    r.UserID,
                    UserName = r.User.UserName + " " + r.User.LastName,
                    UserPhoto = r.User.Photo
                })
                .ToListAsync();

            return Ok(reviews);
        }
    }
}