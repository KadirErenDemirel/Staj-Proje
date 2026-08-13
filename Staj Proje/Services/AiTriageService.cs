namespace Staj_Proje.Services
{
    public class AiTriageService
    {
        public static void AnalizYap(Models.Ticket ticket)
        {
            // Boş ise hata vermemesi için güvenlik önlemi
            string metin = (ticket.Baslik + " " + ticket.Aciklama).ToLower();

            // 1. Durum: Kritik Bug / Hata Tespiti
            if (metin.Contains("hata") || metin.Contains("çalışmıyor") || metin.Contains("çöktü") || metin.Contains("patladı") || metin.Contains("acil"))
            {
                ticket.AciliyetSeviyesi = "Kritik";
                ticket.Departman = "Yazılım Geliştirme";
                ticket.ZorlukDerecesi = "8"; 
            }
            // 2. Durum: Ek Gereksinim / Yeni Özellik Tespiti
            else if (metin.Contains("ekle") || metin.Contains("olsa güzel olur") || metin.Contains("buton") || metin.Contains("yeni özellik"))
            {
                ticket.AciliyetSeviyesi = "Orta";
                ticket.Departman = "Ürün Yönetimi";
                ticket.ZorlukDerecesi = "5";
            }
            // 3. Durum: Tasarım / Arayüz Tespiti
            else if (metin.Contains("renk") || metin.Contains("tasarım") || metin.Contains("kaymış") || metin.Contains("görünmüyor"))
            {
                ticket.AciliyetSeviyesi = "Düşük";
                ticket.Departman = "UI/UX Tasarım";
                ticket.ZorlukDerecesi = "3";
            }
            // 4. Durum: Hiçbirine Uymazsa (Standart Geri Bildirim)
            else
            {
                ticket.AciliyetSeviyesi = "Düşük";
                ticket.Departman = "Müşteri Destek";
                ticket.ZorlukDerecesi = "2";
            }
        }
    }
}