using RentApartmentWebsite.Server.Models;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public IActionResult GetAdmins()
        {
            var admins = _context.Admins.ToList();
            return Ok(admins);
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
                storedHashBytes = Convert.FromBase64String(admin.HashedPassword); // Декодирование хеша пароля из БД в массив байтов
            }
            catch (FormatException)
            {
                return BadRequest("Stored password is not a valid Base-64 string");
            }

            byte[] salt = new byte[16];
            Array.Copy(storedHashBytes, 0, salt, 0, 16);
            /* Первые 16 байтов декодированного хеша копируются в новый массив salt, 
                                  который представляет собой соль, использованную при хешировании пароля*/

            using (var pbkdf2 = new Rfc2898DeriveBytes(request.Password, salt, 10000))
            { // Используем Rfc2898DeriveBytes, чтобы повторно создать хеш для введенного пароля с использованием той же соли, которая была использована при создании оригинального хеша
                byte[] hash = pbkdf2.GetBytes(20);
                byte[] hashBytes = new byte[36];
                Array.Copy(salt, 0, hashBytes, 0, 16);
                Array.Copy(hash, 0, hashBytes, 16, 20);
                string enteredPasswordHash = Convert.ToBase64String(hashBytes);
                // Создаём новый массив байтов hashBytes, в котором сначала идут байты соли, а затем байты хеша. Затем этот массив конвертируется в строку

                if (enteredPasswordHash == admin.HashedPassword)
                {
                    return Ok(admin);
                }
                else
                {
                    return Unauthorized("Incorrect password");
                }
            }
        }

        [HttpGet("convert-password")]
        public IActionResult ConvertPassword([FromQuery] string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                return BadRequest("Password is required");
            }

            byte[] salt = new byte[16];
            new RNGCryptoServiceProvider().GetBytes(salt); // Заполняем массив случайными байтами

            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000); //Создаем экземпляр класса Rfc2898DeriveBytes, который представляет собой реализацию алгоритма PBKDF2 (усложняем пароль)
            //В конструкторе передаются пароль, соль, и количество итераций (10000)
            byte[] hash = pbkdf2.GetBytes(20); // Вычисляем хеш пароля с использованием алгоритма PBKDF2 и возвращаем 20 байт хеша

            byte[] hashBytes = new byte[36];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 20); // Создаем массив hashBytes, в который копируются байты соли и байты хеша

            string passwordHash = Convert.ToBase64String(hashBytes);
            string saltStr = Convert.ToBase64String(salt);

            return Ok(new { passwordHash, salt = saltStr });
        }

        [HttpGet("check-login/{login}")]
        public IActionResult CheckLogin(string login)
        {
            var exists = _context.Admins.Any(a => a.AdminLogin == login);
            return Ok(exists);
        }

        [HttpPost("add-admin")]
        public async Task<IActionResult> AddAdmin([FromBody] Admin admin)
        {
            if (admin == null || string.IsNullOrEmpty(admin.AdminName) || string.IsNullOrEmpty(admin.AdminLogin) || string.IsNullOrEmpty(admin.HashedPassword) || string.IsNullOrEmpty(admin.Salt))
            {
                return BadRequest("Invalid admin data");
            }

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(AddAdmin), new { id = admin.AdminID }, admin); // HTTP-ответ со статусом 201, который содержит id админа
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
            return Ok(admin);
        }

        [HttpPut("new-password/{id}")]
        public IActionResult UpdateAdminPassword(int id, [FromBody] PasswordUpdateModel model)
        {
            var admin = _context.Admins.FirstOrDefault(a => a.AdminID == id);
            if (admin == null)
            {
                return NotFound(new { message = "Admin not found" });
            }

            if (string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest(new { message = "Password cannot be empty" });
            }

            byte[] salt = new byte[16];
            new RNGCryptoServiceProvider().GetBytes(salt);
            var pbkdf2 = new Rfc2898DeriveBytes(model.Password, salt, 10000);
            byte[] hash = pbkdf2.GetBytes(20);
            byte[] hashBytes = new byte[36];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 20);
            string passwordHash = Convert.ToBase64String(hashBytes);
            string saltStr = Convert.ToBase64String(salt);

            admin.HashedPassword = passwordHash;
            admin.Salt = saltStr;

            _context.SaveChanges();
            return Ok(new { message = "Password updated successfully!" });
        }
    }

    public class PasswordUpdateModel
    {
        public string Password { get; set; }
    }
}