using Microsoft.EntityFrameworkCore;

namespace Staj_Proje.Models
{
    public class VeritabaniYonetici : DbContext
    {
        
        public VeritabaniYonetici(DbContextOptions<VeritabaniYonetici> options) : base(options) { }

        public DbSet<Ticket> Tickets { get; set; }
    }
}