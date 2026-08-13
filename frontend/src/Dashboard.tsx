import { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

interface Ticket {
    id: number;
    baslik: string;
    aciliyetSeviyesi: string;
    departman: string;
    durum: string;
}

interface GrafikVerisi {
    name: string;
    deger: number;
}

export default function Dashboard() {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const raporAlaniRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('https://localhost:7107/api/tickets')
            .then(res => res.json())
            .then(data => setTickets(data))
            .catch(err => console.error("Veri çekilemedi:", err));
    }, []);

    const departmanVerisi = tickets.reduce<GrafikVerisi[]>((acc, bilet) => {
        const departmanAdi = bilet.departman || "Diğer";
        const mevcut = acc.find(item => item.name === departmanAdi);
        if (mevcut) mevcut.deger += 1;
        else acc.push({ name: departmanAdi, deger: 1 });
        return acc;
    }, []);

    const aciliyetVerisi = tickets.reduce<GrafikVerisi[]>((acc, bilet) => {
        const aciliyetAdi = bilet.aciliyetSeviyesi || "Normal";
        const mevcut = acc.find(item => item.name === aciliyetAdi);
        if (mevcut) mevcut.deger += 1;
        else acc.push({ name: aciliyetAdi, deger: 1 });
        return acc;
    }, []);

    const renkler = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const ozelEtiket = (props: unknown) => {
        const veri = props as { name: string; percent: number };
        return `${veri.name} ${((veri.percent || 0) * 100).toFixed(0)}%`;
    };

    const pdfIndir = async () => {
        const element = raporAlaniRef.current;
        if (!element) return;

        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const veriURL = canvas.toDataURL('image/png');

            const pdf = new jsPDF('landscape', 'mm', 'a4');
            const pdfGenislik = pdf.internal.pageSize.getWidth();
            const pdfYukseklik = (canvas.height * pdfGenislik) / canvas.width;

            pdf.addImage(veriURL, 'PNG', 0, 0, pdfGenislik, pdfYukseklik);
            pdf.save('Sistem-Istatistik-Raporu.pdf');
        } catch (error) {
            console.error("PDF oluşturulurken hata:", error);
        }
    };

    return (
        <div className="bg-gray-50 font-sans w-full">

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Sistem İstatistikleri (Dashboard)</h2>
                <button
                    onClick={pdfIndir}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2"
                >
                    📄 PDF Raporu İndir
                </button>
            </div>

            <div ref={raporAlaniRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-gray-50">

                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                    <h3 className="text-lg font-bold text-gray-700 mb-6 text-center">Departmanlara Göre Talepler</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={departmanVerisi}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                
                                <Bar dataKey="deger" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-500">
                    <h3 className="text-lg font-bold text-gray-700 mb-6 text-center">Aciliyet Seviyelerine Göre Dağılım</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                
                                <Pie
                                    data={aciliyetVerisi}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="deger"
                                    label={ozelEtiket}
                                >
                                    {aciliyetVerisi.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={renkler[index % renkler.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}