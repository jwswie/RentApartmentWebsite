using RentApartmentWebsite.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace RentApartmentWebsite.Server
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Apartment> Apartments { get; set; }

        public DbSet<ApartmentInfrastructure> ApartmentInfrastructures { get; set; }

        public DbSet<ApartmentCategory> ApartmentCategories { get; set; }
    }
}