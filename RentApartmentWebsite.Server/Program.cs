using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

namespace RentApartmentWebsite.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args); // Настройки приложения

            builder.Services.AddControllers(); // Приложение будет использовать контроллеры

            builder.Services.AddDbContext<ApplicationDbContext>(options => // Взаимодействие с БД SQL Server 
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))); // Строка подключения из appsettings.json

            builder.Services.AddSwaggerGen(c => // Инструмент, который создаёт автоматическую документацию API
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" }); // Название и версия API
            });

            var app = builder.Build(); // Объект, который управляет обработкой HTTP-запросов

            if (app.Environment.IsDevelopment()) // Если приложение запущено в режиме разработки
            {
                app.UseDeveloperExceptionPage(); // Показывает детальные ошибки

                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1")); // Включаем Swagger UI
            }

            app.UseHttpsRedirection(); // Если браузер зашёл по http://, он автоматически перейдёт на https://
            app.UseStaticFiles(); // Позволяет загружать файлы из wwwroot
            app.UseRouting(); // Определяет, какие URL-адреса к каким контроллерам относятся
            app.UseAuthorization(); // Позволяет использовать проверку пользователей (если в API есть авторизация)

            app.MapControllers(); // Если есть, например, TestController, то по адресу /api/test будет работать этот API

            app.Run(); // Запускает веб-сервер и начинает принимать запросы
        }
    }
}