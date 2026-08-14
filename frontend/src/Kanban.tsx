import { useEffect, useState } from 'react';

interface Ticket {
    id: number;
    musteriAdSoyad: string;
    baslik: string;
    aciklama: string;
    aciliyetSeviyesi: string;
    departman: string;
    zorlukDerecesi: string;
    durum: string;
}

export default function Kanban() {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        fetch('https://localhost:7107/api/tickets')
            .then(res => res.json())
            .then(data => setTickets(data))
            .catch(err => console.error("API'den veri çekilemedi:", err));
    }, []);

    const biletSil = async (id: number) => {
        if (!window.confirm("Bu bileti silmek istediğine emin misin?")) return;

        try {
            const response = await fetch(`https://localhost:7107/api/tickets/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTickets(tickets.filter(t => t.id !== id));
            } else {
                alert("Silme işlemi başarısız oldu!");
            }
        } catch (error) {
            console.error("Silinirken hata oluştu:", error);
        }
    };

    const durumGuncelle = async (bilet: Ticket, yeniDurum: string) => {
        const guncelBilet = { ...bilet, durum: yeniDurum };

        try {
            const response = await fetch(`https://localhost:7107/api/tickets/${bilet.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(guncelBilet)
            });

            if (response.ok) {
                setTickets(tickets.map(t => t.id === bilet.id ? guncelBilet : t));
            } else {
                alert("Durum güncellenemedi! Sunucu bir hata döndürdü.");
            }
        } catch (error) {
            console.error("Güncellenirken hata oluştu:", error);
        }
    };

    
    const markdownIndir = (bilet: Ticket) => {
        
        const mdIcerik = `
# Bilet Detayı: ${bilet.baslik}

**Müşteri:** ${bilet.musteriAdSoyad || "Bilinmiyor"}
**Durum:** ${bilet.durum || "Onay Bekliyor"}
**Departman:** ${bilet.departman}
**Aciliyet:** ${bilet.aciliyetSeviyesi}

## Açıklama
${bilet.aciklama}
    `.trim();

        
        const blob = new Blob([mdIcerik], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        
        const a = document.createElement('a');
        a.href = url;
       
        a.download = `Bilet-${bilet.id}-${bilet.baslik.replace(/\s+/g, '-')}.md`;
        document.body.appendChild(a);
        a.click();

        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const sutunlar = ["Onay Bekliyor", "Geliştiriliyor", "Test Aşamasında", "Tamamlandı"];

    return (
        <div className="bg-gray-50 font-sans">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Bilet Takip Sistemi</h2>

            <div className="flex gap-6 overflow-x-auto pb-4">
                {sutunlar.map(sutunAdi => (
                    <div key={sutunAdi} className="bg-gray-200 rounded-xl p-4 min-w-[320px] flex-1 shadow-inner">
                        <h3 className="font-semibold text-lg text-gray-700 mb-4 border-b border-gray-300 pb-2">
                            {sutunAdi}
                        </h3>

                        <div className="space-y-4">
                            {tickets
                                .filter(t => (t.durum || "Onay Bekliyor") === sutunAdi)
                                .map(bilet => (
                                    <div key={bilet.id} className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-600 hover:shadow-lg transition-shadow">
                                        <h4 className="font-bold text-gray-800 text-md">{bilet.baslik}</h4>
                                        <p className="text-xs text-gray-500 font-medium mt-1">{bilet.musteriAdSoyad || "Bilinmiyor"}</p>
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{bilet.aciklama}</p>

                                        {/* YETKİLİ İÇİN DURUM DEĞİŞTİRME MENÜSÜ */}
                                        <div className="mt-4 pt-3 border-t border-gray-100">
                                            <label className="text-xs text-gray-500 font-semibold mb-1 block">Aşama Değiştir (Yetkili):</label>
                                            <select
                                                value={bilet.durum || "Onay Bekliyor"}
                                                onChange={(e) => durumGuncelle(bilet, e.target.value)}
                                                className="w-full text-sm border-gray-300 rounded-md shadow-sm p-1.5 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 cursor-pointer font-medium text-gray-700"
                                            >
                                                {sutunlar.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mt-4 flex justify-between items-center">
                                            <div className="flex gap-2">
                                                <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                                    {bilet.aciliyetSeviyesi}
                                                </span>
                                                <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                                                    {bilet.departman}
                                                </span>
                                            </div>

                                            {/* YENİ: BUTONLAR GRUBU (İndir ve Sil Yanyana) */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => markdownIndir(bilet)}
                                                    className="text-xs font-bold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-md transition-colors shadow-sm"
                                                >
                                                    ⬇️ MD İndir
                                                </button>
                                                <button
                                                    onClick={() => biletSil(bilet.id)}
                                                    className="text-xs font-bold text-white bg-red-500 hover:bg-red-700 px-3 py-1.5 rounded-md transition-colors shadow-sm"
                                                >
                                                    Sil
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}