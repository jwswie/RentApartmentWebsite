using RentApartmentWebsite.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using System.Data;

namespace RentApartmentWebsite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public class VerificationStore
        {
            public string Code { get; set; }
            public DateTime ExpirationTime { get; set; }
        }

        public class VerifyCodeRequest
        {
            public string Email { get; set; }
            public string Code { get; set; }
        }


        private static Dictionary<string, VerificationStore> _codes = new();

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Signup), new { id = user.UserID }, user); // HTTP-ответ со статусом 201, который содержит id пользователя
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

            _codes[emailAddress] = new VerificationStore
            {
                Code = verificationCode,
                ExpirationTime = DateTime.UtcNow.AddMinutes(20)
            };

            var fromAddress = new MailAddress("kobzevastep@gmail.com", "Rent Apartment Website");
            var toAddress = new MailAddress(emailAddress, "To Name");
            const string fromPassword = "nvbz qavb jfyd qede";
            const string subject = "Your Verification Code";
            string body = $"Your verification code is: {verificationCode}";

            var smtp = new SmtpClient // Создание SMTP-клиента
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true, // Шифрование
                DeliveryMethod = SmtpDeliveryMethod.Network, // Отправка через интернет
                UseDefaultCredentials = false, // Не используем учётные данные Windows, а задаём свои
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            using (var message = new MailMessage(fromAddress, toAddress) // Создание письма
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = false // Письмо будет обычным текстом
            })
            {
                smtp.Send(message);
            }

            Console.WriteLine("Code send");

            return Ok(new { verificationCode });
        }

        [HttpPost("verify-code")]
        public IActionResult VerifyCode([FromBody] VerifyCodeRequest request)
        {
            Console.WriteLine(_codes);
            Console.WriteLine(request.Email);

            if (_codes.TryGetValue(request.Email, out var store))
            {
                if (DateTime.UtcNow > store.ExpirationTime)
                    return BadRequest("Code expired");

                if (store.Code == request.Code)
                {
                    _codes.Remove(request.Email); // удалить код после верификации
                    return Ok("Verified");
                }
            }

            return BadRequest("Invalid code");
        }


        [HttpGet("check-email/{emailAddress}")]
        public IActionResult CheckEmailAddress(string emailAddress)
        {
            var exists = _context.Users.Any(u => u.EmailAddress == emailAddress);
            return Ok(exists);
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
        public IActionResult UpdateUser(int id, [FromBody] UserDto updatedUser)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserID == id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.UserName = updatedUser.UserName;
            user.LastName = updatedUser.LastName;

            if (!string.IsNullOrEmpty(updatedUser.PhotoBase64))
            {
                try
                {
                    user.Photo = Convert.FromBase64String(updatedUser.PhotoBase64);
                }
                catch
                {
                    return BadRequest("Invalid base64 string for photo");
                }
            }

            _context.SaveChanges();

            var responseUser = new
            {
                user.UserID,
                user.UserName,
                user.LastName,
                user.EmailAddress,
                Photo = user.Photo != null ? Convert.ToBase64String(user.Photo) : null,
                user.RegistrationDate,
                user.TrustRating,
                user.Biography,
                user.Location,
                user.University,
                user.Pets,
                user.DreamTrip,
                user.Profession,
                user.Hobby,
                user.BadHabits
            };

            return Ok(responseUser);
        }
    }
}