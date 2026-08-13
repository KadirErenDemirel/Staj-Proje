namespace Staj_Proje.Services
{
    public class AiTriageService
    {
        public static void AnalizYap(Models.Ticket ticket)
        {
            
            string metin = (ticket.Baslik + " " + ticket.Aciklama).ToLower();

            
            if (metin.Contains("hata") || metin.Contains("çalışmıyor") || metin.Contains("çöktü") || metin.Contains("patladı") || metin.Contains("acil"))
            {
                ticket.AciliyetSeviyesi = "Kritik";
                ticket.Departman = "Yazılım Geliştirme";
                ticket.ZorlukDerecesi = "8"; 
            }
            
            else if (metin.Contains("ekle") || metin.Contains("olsa güzel olur") || metin.Contains("buton") || metin.Contains("yeni özellik"))
            {
                ticket.AciliyetSeviyesi = "Orta";
                ticket.Departman = "Ürün Yönetimi";
                ticket.ZorlukDerecesi = "5";
            }
            
            else if (metin.Contains("renk") || metin.Contains("tasarım") || metin.Contains("kaymış") || metin.Contains("görünmüyor"))
            {
                ticket.AciliyetSeviyesi = "Düşük";
                ticket.Departman = "UI/UX Tasarım";
                ticket.ZorlukDerecesi = "3";
            }
            
            else
            {
                ticket.AciliyetSeviyesi = "Düşük";
                ticket.Departman = "Müşteri Destek";
                ticket.ZorlukDerecesi = "2";
            }
        }
    }
}