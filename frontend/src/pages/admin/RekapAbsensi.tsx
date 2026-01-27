import { useState, useEffect } from 'react';
import { 
  Search, Printer, Sparkles, CalendarCheck, 
  ChevronDown, Loader2, UserCheck, LayoutGrid,
  Filter
} from 'lucide-react';
import LoadAnimate from '../../components/layout/LoadAnimate';

const RekapAbsensi = () => {
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [selectedJadwal, setSelectedJadwal] = useState<any>(null);
  const [selectedSesi, setSelectedSesi] = useState<string>("all"); // State untuk Sesi
  const [absensiData, setAbsensiData] = useState<any[]>([]);
  
  const [isJadwalOpen, setIsJadwalOpen] = useState(false);
  const [isSesiOpen, setIsSesiOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const token = localStorage.getItem('token');

  // 1. Samakan Fetch Jadwal dengan InputNilai (Gunakan endpoint yang sudah pasti jalan)
  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        // Jika di InputNilai menggunakan endpoint lain, ganti URL di bawah ini
        const res = await fetch('http://localhost:5000/api/admin/reports/jadwal-aktif', {
          headers: { Authorization: `Bearer ${token}` }
        }); 
        const result = await res.json();
        if (result.success) setJadwalList(result.data);
      } catch (e) { 
        console.error("Error Fetch Jadwal:", e); 
      } finally {
        setTimeout(() => setIsInitialLoading(false), 1000);
      }
    };
    fetchJadwal();
  }, []);

  // 2. Fetch Absensi (Pastikan Parameter id_jadwal dan pertemuan sesuai backend)
  const fetchAbsensi = async (jadwal: any, pertemuan: string = "all") => {
    setSelectedJadwal(jadwal);
    setSelectedSesi(pertemuan);
    setIsJadwalOpen(false);
    setIsSesiOpen(false);
    setLoading(true);
    
    try {
      const url = `http://localhost:5000/api/admin/reports/absensi?id_jadwal=${jadwal.id_jadwal}&pertemuan=${pertemuan}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      
      // VALIDASI DATA: Pastikan result.data adalah array
      if (result.success && Array.isArray(result.data)) {
        setAbsensiData(result.data);
      } else if (Array.isArray(result)) {
        // Jika API mengirim array langsung tanpa bungkus .data
        setAbsensiData(result);
      } else {
        setAbsensiData([]); // Fallback ke array kosong
      }
    } catch (e) { 
      console.error("Error Fetch Absensi:", e);
      setAbsensiData([]); // Mencegah undefined saat error jaringan
    } finally { 
      setTimeout(() => setLoading(false), 600); 
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20 p-2 md:p-0">
      
      {/* HEADER */}
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> ATTENDANCE SYSTEM
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              REKAP <span className="text-indigo-500 italic">ABSENSI</span>
            </h1>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CalendarCheck size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Status</p>
              <p className="text-xl font-bold text-white uppercase tracking-tight">
                {selectedJadwal ? 'Monitoring' : 'Standby'}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {isInitialLoading ? (
        <div className="py-20"><LoadAnimate userType="staff" duration={1000} /></div>
      ) : (
        <>
          {/* SELECTION CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-30">
            {/* Combobox Matakuliah */}
            <div className="md:col-span-3 relative">
              <button 
                onClick={() => { setIsJadwalOpen(!isJadwalOpen); setIsSesiOpen(false); }}
                className={`w-full flex items-center justify-between p-6 bg-white border-2 rounded-[2rem] font-black text-[12px] uppercase tracking-widest transition-all ${isJadwalOpen ? 'border-indigo-500 shadow-xl' : 'border-slate-100'}`}
              >
                <div className="flex items-center gap-4 truncate">
                  <LayoutGrid size={20} className="text-indigo-600" />
                  <span className="truncate">{selectedJadwal ? `${selectedJadwal.NamaMatkul} - KELAS ${selectedJadwal.Kelas}` : "PILIH MATA KULIAH..."}</span>
                </div>
                <ChevronDown size={20} className={`transition-transform ${isJadwalOpen ? 'rotate-180' : ''}`} />
              </button>

              {isJadwalOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] p-4 z-50 max-h-[350px] overflow-y-auto animate-in zoom-in-95">
                  {jadwalList.map((j) => (
                    <button 
                      key={j.id_jadwal}
                      onClick={() => fetchAbsensi(j, selectedSesi)}
                      className="w-full text-left p-5 hover:bg-indigo-50 rounded-2xl transition-all border-b border-slate-50 last:border-0"
                    >
                      <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">{j.id_jadwal}</p>
                      <p className="text-sm font-black text-slate-800 uppercase">{j.NamaMatkul || j.nama_matkul}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Kelas {j.Kelas} • {j.NamaDosen}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Combobox Sesi / Pertemuan */}
            <div className="relative">
              <button 
                onClick={() => { setIsSesiOpen(!isSesiOpen); setIsJadwalOpen(false); }}
                className={`w-full flex items-center justify-between p-6 bg-white border-2 rounded-[2rem] font-black text-[12px] uppercase tracking-widest transition-all ${isSesiOpen ? 'border-indigo-500 shadow-xl' : 'border-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <Filter size={18} className="text-indigo-600" />
                  <span>{selectedSesi === "all" ? "SEMUA SESI" : `SESI ${selectedSesi}`}</span>
                </div>
                <ChevronDown size={18} />
              </button>

              {isSesiOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] p-4 z-50 max-h-[300px] overflow-y-auto animate-in zoom-in-95">
                  <button onClick={() => fetchAbsensi(selectedJadwal, "all")} className="w-full text-left p-4 hover:bg-indigo-50 rounded-xl font-bold text-xs uppercase mb-1">Semua Sesi</button>
                  {[...Array(16)].map((_, i) => (
                    <button 
                      key={i+1}
                      onClick={() => selectedJadwal && fetchAbsensi(selectedJadwal, (i+1).toString())}
                      className="w-full text-left p-4 hover:bg-indigo-50 rounded-xl font-bold text-xs uppercase"
                    >
                      Pertemuan {i+1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CONTENT TABLE */}
          <div className="relative min-h-[400px]">
            {loading ? (
              <div className="py-20"><LoadAnimate userType="staff" duration={800} /></div>
            ) : selectedJadwal ? (
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6">
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><UserCheck size={24} /></div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{selectedJadwal.NamaMatkul}</h2>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Filter: {selectedSesi === 'all' ? 'Seluruh Pertemuan' : `Pertemuan Ke-${selectedSesi}`}</p>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all">
                    <Printer size={16} /> EXPORT PDF
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <th className="px-10 py-6 border-b">Mahasiswa</th>
                        <th className="px-6 py-6 border-b text-center">Hadir</th>
                        <th className="px-6 py-6 border-b text-center">Izin</th>
                        <th className="px-6 py-6 border-b text-center">Sakit</th>
                        <th className="px-6 py-6 border-b text-center text-rose-500">Alfa</th>
                        <th className="px-10 py-6 border-b text-center">Persentase</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {/* Tambahkan ?. sebelum .map agar tidak crash jika absensiData null */}
                      {absensiData?.map((m, idx) => {
                        const total = (m.Hadir || 0) + (m.Izin || 0) + (m.Sakit || 0) + (m.Alfa || 0);
                        const percent = total > 0 ? ((m.Hadir / total) * 100).toFixed(0) : 0;
                        
                        return (
                          <tr key={idx} className="group hover:bg-slate-50">
                            <td className="px-10 py-8 font-black text-sm uppercase text-slate-800">
                              {m.Nama}<br/>
                              <span className="text-[10px] text-slate-400 font-bold">{m.NPM}</span>
                            </td>
                            <td className="px-6 py-8 text-center font-black text-emerald-600">{m.Hadir || 0}</td>
                            <td className="px-6 py-8 text-center font-black text-amber-500">{m.Izin || 0}</td>
                            <td className="px-6 py-8 text-center font-black text-blue-500">{m.Sakit || 0}</td>
                            <td className="px-6 py-8 text-center font-black text-rose-500">{m.Alfa || 0}</td>
                            <td className="px-10 py-8 text-center">
                              <span className={`px-4 py-2 rounded-xl text-[10px] font-black ${Number(percent) < 75 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {percent}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white py-40 rounded-[4rem] border-4 border-dashed border-slate-50 text-center flex flex-col items-center animate-in fade-in">
                 <UserCheck size={48} className="text-slate-200 mb-6" />
                 <h3 className="text-2xl font-black uppercase text-slate-300 tracking-[0.3em]">Siap Memonitor</h3>
                 <p className="text-slate-400 text-[11px] font-bold mt-2 uppercase tracking-widest max-w-[280px]">Pilih mata kuliah dan sesi pertemuan untuk melihat rekap kehadiran.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RekapAbsensi;
