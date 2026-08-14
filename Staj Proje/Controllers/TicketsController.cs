using Microsoft.AspNetCore.Mvc;
using Staj_Proje.Models;
using System.Net.Sockets;

namespace Staj_Proje.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class TicketsController : ControllerBase
    {
        private readonly VeritabaniYonetici _context;
        public TicketsController(VeritabaniYonetici context)
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
        [HttpPost]
       
        public async Task<IActionResult> PostTicket([FromForm] TalepOlusturDto formVerisi)
        {
            string dosyaYolu = null;

            
            if (formVerisi.EkDosya != null && formVerisi.EkDosya.Length > 0)
            {
                
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                
                var benzersizDosyaAdi = Guid.NewGuid().ToString() + "_" + formVerisi.EkDosya.FileName;
                var tamYol = Path.Combine(uploadsFolder, benzersizDosyaAdi);

                
                using (var stream = new FileStream(tamYol, FileMode.Create))
                {
                    await formVerisi.EkDosya.CopyToAsync(stream);
                }

                
                dosyaYolu = "/uploads/" + benzersizDosyaAdi;
            }

           
            var yeniBilet = new Ticket
            {
                musteriAdSoyad = formVerisi.MusteriAdSoyad,
                Baslik = formVerisi.Baslik,
                Aciklama = formVerisi.Aciklama,
                TalepTuru = formVerisi.Tur,
                Departman = "Müşteri Destek", 
                AciliyetSeviyesi = "Normal",
                Durum = "Onay Bekliyor",
                DosyaYolu = dosyaYolu 
            };
            
            Staj_Proje.Services.AiTriageService.AnalizYap(yeniBilet);
            _context.Tickets.Add(yeniBilet);
            await _context.SaveChangesAsync();

            return Ok(yeniBilet);
        }

        //Ticket Güncelleme ( PUT )
        [HttpPut("{id}")]
        public IActionResult Guncelle(int id, Ticket bilet)
        {
            if (id != bilet.Id)
                return BadRequest("ID'ler uyuşmuyor kanka!");

            _context.Tickets.Update(bilet);
            _context.SaveChanges();
            return Ok(bilet);
        }

        // Ticket Silme ( DELETE )
        [HttpDelete("{id}")]
        public IActionResult Sil(int id)
        {
            var silinecekBilet = _context.Tickets.Find(id);
            if (silinecekBilet == null)
                return NotFound("Silinecek bilet bulunamadı!");

            _context.Tickets.Remove(silinecekBilet);
            _context.SaveChanges();
            return Ok();
        }
        public class TalepOlusturDto
        {
            public string MusteriAdSoyad { get; set; }
            public string Baslik { get; set; }
            public string Aciklama { get; set; }
            public string Tur { get; set; }
            public IFormFile? EkDosya { get; set; } 
        }
    }
}

