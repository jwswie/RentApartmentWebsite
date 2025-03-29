using RentApartmentWebsite.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity.Data;

namespace RentApartmentWebsite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("login/{adminLogin}")]
        public IActionResult Login(string adminLogin)
        {
            var admin = _context.Admins.FirstOrDefault(u => u.AdminLogin == adminLogin);

            if (admin == null)
            {
                return NotFound(new { message = "Login not found" });
            }

            return Ok(admin);
        }

        [HttpPost("check-password")]
        public IActionResult CheckPassword([FromBody] LoginRequest request)
        {
            var admin = _context.Admins.FirstOrDefault(a => a.AdminLogin == request.Email);
            if (admin == null)
            {
                return NotFound("Admin not found");
            }

            byte[] storedHashBytes;
            try
            {
                storedHashBytes = Convert.FromBase64String(admin.HashedPassword);
            }
            catch (FormatException)
            {
                return BadRequest("Stored password is not a valid Base-64 string.");
            }

            byte[] salt = new byte[16];
            Array.Copy(storedHashBytes, 0, salt, 0, 16);

            using (var pbkdf2 = new Rfc2898DeriveBytes(request.Password, salt, 10000))
            {
                byte[] hash = pbkdf2.GetBytes(20);
                byte[] hashBytes = new byte[36];
                Array.Copy(salt, 0, hashBytes, 0, 16);
                Array.Copy(hash, 0, hashBytes, 16, 20);
                string enteredPasswordHash = Convert.ToBase64String(hashBytes);

                return Ok(enteredPasswordHash == admin.HashedPassword);
            }
        }

        [HttpGet]
        public IActionResult GetAdmins()
        {
            var admins = _context.Admins.ToList();
            return Ok(admins);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAdmin(int id)
        {
            var admin = _context.Admins.FirstOrDefault(a => a.AdminID == id);
            if (admin == null)
            {
                return NotFound(new { message = "Admin not found" });
            }

            _context.Admins.Remove(admin);
            _context.SaveChanges();

            return Ok(new { message = "Admin deleted successfully" });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateAdmin(int id, [FromBody] Admin updatedAdmin)
        {
            var admin = _context.Admins.FirstOrDefault(a => a.AdminID == id);
            if (admin == null)
            {
                return NotFound(new { message = "Admin not found" });
            }

            admin.AdminName = updatedAdmin.AdminName;
            admin.AdminLogin = updatedAdmin.AdminLogin;

            _context.SaveChanges();
            return Ok(new { message = "Admin updated successfully" });
        }

    }
}
