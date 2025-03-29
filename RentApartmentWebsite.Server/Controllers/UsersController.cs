using RentApartmentWebsite.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

namespace RentApartmentWebsite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] User user)
        {
            if (user == null || string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(user.EmailAddress))
            {
                return BadRequest("Invalid user data");
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Signup), new { id = user.UserID }, user);
        }

        [HttpGet("login/{emailAddress}")]
        public IActionResult Login(string emailAddress)
        {
            var user = _context.Users.FirstOrDefault(u => u.EmailAddress == emailAddress);

            if (user == null)
            {
                return NotFound(new { message = "Email address not found. Please sign up" });
            }

            return Ok(user);
        }

        [HttpGet("send-code/{emailAddress}")]
        public IActionResult SendVerificationCode(string emailAddress)
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var verificationCode = new string(Enumerable.Range(0, 6).Select(_ => chars[random.Next(chars.Length)]).ToArray()); // Генерируем код верификации

            var fromAddress = new MailAddress("kobzevastep@gmail.com", "Rent Apartment Website");
            var toAddress = new MailAddress(emailAddress, "To Name");
            const string fromPassword = "nvbz qavb jfyd qede";
            const string subject = "Your Verification Code";
            string body = $"Your verification code is: {verificationCode}";

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            })
            {
                smtp.Send(message);
            }

            return Ok(new { verificationCode });
        }


        [HttpGet("check-email/{emailAddress}")]
        public IActionResult CheckEmailAddress(string emailAddress)
        {
            var exists = _context.Users.Any(u => u.EmailAddress == emailAddress);
            return Ok(exists);
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.FirstOrDefault(a => a.UserID == id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User updatedUser)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserID == id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.UserName = updatedUser.UserName;
            user.EmailAddress = updatedUser.EmailAddress;

            _context.SaveChanges();
            return Ok(new { message = "User updated successfully" });
        }
    }
}