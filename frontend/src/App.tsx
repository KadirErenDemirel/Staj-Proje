import { useState, FormEvent } from 'react';

function App() {
    const [baslik, setBaslik] = useState<string>('');
    const [aciklama, setAciklama] = useState<string>('');
    const [tur, setTur] = useState<string>('Hata (Bug) Bildirimi');

    const formGonder = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("C# API'ye Gidecek Veri:", { baslik, aciklama, tur });
        alert("Form Başarıyla Çalışıyor! C# backendine bağlanmayı bekliyor.");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl border-t-4 border-blue-600">
                <h2 className="text-2xl font-bold mb-6 text-gray-800"> Yeni Talep (Ticket) Oluştur</h2>

                <form onSubmit={formGonder} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1"> Talep Başlığı </label>
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1"> Talep Türü </label>
                        <select
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            value={tur}
                            onChange={(e) => setTur(e.target.value)}
                        >
                            <option> Hata (Bug) Bildirimi </option>
                            <option> Yeni Proje Brifi </option>
                            <option> Ek Gereksinim </option>
                            <option> Geri Bildirim </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1"> Detaylı Açıklama </label>
                        <textarea
                            className="block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            rows={5}
                            placeholder="Lütfen talebinizi veya karşılaştığınız sorunu detaylıca açıklayın..."
                            value={aciklama}
                            onChange={(e) => setAciklama(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
                    >
                        Talebi İlet
                    </button>
                </form>
            </div>
        </div>
    );
}

export default App;