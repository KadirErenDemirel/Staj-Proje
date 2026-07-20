namespace Staj_Proje.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public string? Baslik {  get; set; }
        public string? Aciklama { get; set; }
        public string? AciliyetSeviyesi { get; set; }
        public string? Durum {  get; set; }
        public string? Departman { get; set; }
        public string? ZorulukDerecesi {  get; set; }
        public DateTime OlusturulmaTarihi { get; set; }

    }
}