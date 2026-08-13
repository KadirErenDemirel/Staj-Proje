import { useState, useRef } from 'react';
import Kanban from './Kanban';
import Dashboard from './Dashboard';

function App() {
    const [baslik, setBaslik] = useState<string>('');
    const [aciklama, setAciklama] = useState<string>('');
    const [tur, setTur] = useState<string>('Hata (Bug) Bildirimi');
    const [musteriAdSoyad, setMusteriAdSoyad] = useState<string>('');
    const [dosya, setDosya] = useState<File | null>(null);
    const [aktifSayfa, setAktifSayfa] = useState<string>('form');

    // Dosya input'unu fiziksel olarak temizlemek için Ref kullanıyoruz
    const dosyaInputRef = useRef<HTMLInputElement>(null);

    const formGonder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('musteriAdSoyad', musteriAdSoyad);
        formData.append('baslik', baslik);
        formData.append('aciklama', aciklama);
        formData.append('tur', tur);

        if (dosya) {
            formData.append('ekDosya', dosya);
        }

        try {
            const response = await fetch('https://localhost:7107/api/tickets', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert("Bilet ve dosya başarıyla sisteme iletildi!");

                // Kayıttan sonra formun içini TAMAMEN temizle
                setBaslik('');
                setAciklama('');
                setTur('Hata (Bug) Bildirimi');
                setMusteriAdSoyad(''); // İsim alanını sıfırladık
                setDosya(null); // Dosya state'ini sıfırladık

                // Tarayıcıdaki dosya ismini görsel olarak sıfırladık
                if (dosyaInputRef.current) {
                    dosyaInputRef.current.value = '';
                }
            } else {
                alert("Bağlantı başarılı ama sunucu bir hata döndürdü!");
            }
        } catch {
            alert("C# API'ye ulaşılamadı! Sunucu açık mı kontrol et.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">

            {/* ÜST MENÜ (NAVBAR) */}
            <nav className="bg-white shadow-md w-full px-8 py-4 flex justify-between items-center mb-8 border-b-4 border-blue-600">
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Staj<span className="text-blue-600">Proje</span></h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setAktifSayfa('dashboard')}
                        className={`px-5 py-2.5 rounded-md font-semibold transition-all ${aktifSayfa === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        İstatistikler (Dashboard)
                    </button>
                    <button
                        onClick={() => setAktifSayfa('form')}
                        className={`px-5 py-2.5 rounded-md font-semibold transition-all ${aktifSayfa === 'form' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Yeni Talep Oluştur
                    </button>
                    <button
                        onClick={() => setAktifSayfa('kanban')}
                        className={`px-5 py-2.5 rounded-md font-semibold transition-all ${aktifSayfa === 'kanban' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Bilet Takip
                    </button>
                </div>
            </nav>

            {/* İÇERİK ALANI */}
            <div className="w-full px-8 flex flex-col items-center gap-12">

                {aktifSayfa === 'form' && (
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl border-t-4 border-blue-600">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Yeni Talep (Ticket) Oluştur</h2>

                        <form onSubmit={formGonder} className="space-y-6">
                            <div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">👤 Adınız Soyadınız</label>
                                    <input
                                        type="text"
                                        className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={musteriAdSoyad}
                                        onChange={(e) => setMusteriAdSoyad(e.target.value)}
                                        required
                                    />
                                </div>
                                <br></br>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Talep Başlığı</label>
                                <input
                                    type="text"
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Örn: Ödeme ekranında hata alıyorum"
                                    value={baslik}
                                    onChange={(e) => setBaslik(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Talep Türü</label>
                                <select
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                    value={tur}
                                    onChange={(e) => setTur(e.target.value)}
                                >
                                    <option>Hata (Bug) Bildirimi</option>
                                    <option>Yeni Proje Brifi</option>
                                    <option>Ek Gereksinim</option>
                                    <option>Geri Bildirim</option>
                                    <option>Diğer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Detaylı Açıklama</label>
                                <textarea
                                    className="block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                    rows={5}
                                    placeholder="Lütfen talebinizi veya karşılaştığınız sorunu detaylıca açıklayın..."
                                    value={aciklama}
                                    onChange={(e) => setAciklama(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">📎 Proje Brifi / Ek Dosya (PDF, Word)</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    ref={dosyaInputRef} // Ref'i buraya bağladık
                                    onChange={(e) => setDosya(e.target.files ? e.target.files[0] : null)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all border border-gray-300 rounded-lg shadow-sm"
                                />
                                <p className="mt-1 text-xs text-gray-500">Maksimum 5MB boyutunda PDF veya Word belgesi yükleyebilirsiniz.</p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
                            >
                                Talebi İlet
                            </button>
                        </form>
                    </div>
                )}


                {aktifSayfa === 'kanban' && (
                    <div className="w-full max-w-[90rem]">
                        <Kanban />
                    </div>
                )}

                {aktifSayfa === 'dashboard' && (
                    <div className="w-full max-w-[90rem]">
                        <Dashboard />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;