using Microsoft.AspNetCore.Mvc;
using Staj_Proje.Models;

namespace Staj_Proje.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class Ticketkontrolü : ControllerBase
    {
        private readonly VeritabaniYonetici _context;
        public Ticketkontrolü(VeritabaniYonetici context)
        {
            _context = context;
        }
        // Ticket Listeleme ( GET )
        [HttpGet]
        public IActionResult HepsiniGetir()
        {
            return Ok(_context.Tickets.ToArray().ToList());
        }
        // Ticket ekleme ( POST ) 
        [HttpPost]
        public IActionResult YeniEkle(Ticket bilet)
        {
            _context.Tickets.Add(bilet);
            _context.SaveChanges();
            return Ok(bilet);
        }
    }
}

