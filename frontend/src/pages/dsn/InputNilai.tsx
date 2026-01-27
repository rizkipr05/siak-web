import { useState, useEffect, useMemo } from 'react';
import { 
  Search, Save, ChevronDown, 
  Sparkles, GraduationCap, User,
  FileSpreadsheet
} from 'lucide-react';
import { ModalCustom } from '../../components/layout/ModalCustom';
import LoadAnimate from '../../components/layout/LoadAnimate';

const InputNilai = () => {
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [mahasiswaList, setMahasiswaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 
  const [loadingContent, setLoadingContent] = useState(false); 
  
  const [isJadwalOpen, setIsJadwalOpen] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const userData = useMemo(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : {};
  }, []);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJadwal = async () => {
      const startTime = Date.now();
      try {
        const nidn = userData.nidn || userData.id;
        const response = await fetch(`http://localhost:5000/api/dosen/jadwal/${nidn}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setJadwalList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        const duration = Date.now() - startTime;
        setTimeout(() => setLoading(false), Math.max(0, 1000 - duration));
      }
    };
    if (userData.id || userData.nidn) fetchJadwal();
  }, [userData, token]);

  const fetchMahasiswa = async (id_jadwal: string) => {
    setLoadingContent(true); 
    try {
      setSearchTerm(""); 
      const res = await fetch(`http://localhost:5000/api/dosen/nilai/peserta/${id_jadwal}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await res.json();
      const dataFinal = Array.isArray(result) ? result : (result.data || []);
      setMahasiswaList(dataFinal);
    } catch (err) {
      console.error(err);
      setMahasiswaList([]);
    } finally {
      setTimeout(() => setLoadingContent(false), 800);
    }
  };

  const handleSelectJadwal = (jadwal: any) => {
    setSelectedJadwal(jadwal);
    setIsJadwalOpen(false);
    if (jadwal.id_jadwal) fetchMahasiswa(jadwal.id_jadwal);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const val = parseFloat(value);
    if (val > 100) return;
    const updated = [...mahasiswaList];
    updated[index] = { ...updated[index], [field]: value };
    setMahasiswaList(updated);
  };

  const handleSimpanNilai = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/dosen/nilai/update', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_jadwal: selectedJadwal.id_jadwal,
          payload: mahasiswaList
        })
      });
      if (res.ok) {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredMahasiswa = useMemo(() => {
    return mahasiswaList.filter(m => 
      (m.NamaMahasiswa || m.Nama || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (m.NPM || "").includes(searchTerm)
    );
  }, [mahasiswaList, searchTerm]);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20 p-2 md:p-0">
      
      {/* HEADER SECTION - IDENTIK DENGAN PERTEMUAN */}
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> SIAK - DOSEN
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              INPUT <span className="text-rose-500 italic">NILAI</span>
            </h1>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-5">
            <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/40">
              <FileSpreadsheet size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Peserta Kelas</p>
              <p className="text-2xl font-bold text-white leading-tight">
                {mahasiswaList.length} <span className="text-xs text-rose-500 uppercase">Mhs</span>
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative min-h-[400px] space-y-6 md:space-y-8">
        {loading ? (
          <div className="py-24 flex justify-center items-center">
            <LoadAnimate userType="dosen" />
          </div>
        ) : (
          <>
            {/* FILTER & SEARCH */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="relative md:col-span-2">
                <button 
                  onClick={() => setIsJadwalOpen(!isJadwalOpen)}
                  className={`w-full flex items-center justify-between p-5 md:p-6 bg-white border-2 border-slate-100 rounded-[2rem] font-black text-[11px] md:text-[12px] uppercase tracking-widest transition-all shadow-sm ${isJadwalOpen ? 'border-rose-500 shadow-xl shadow-rose-50' : 'hover:border-rose-200'}`}
                >
                  <span className={selectedJadwal ? 'text-slate-900 truncate pr-4' : 'text-slate-400'}>
                    {selectedJadwal ? `${selectedJadwal.NamaMatkul} — Kelas ${selectedJadwal.Kelas}` : "Pilih Mata Kuliah Anda"}
                  </span>
                  <ChevronDown size={20} className={`flex-shrink-0 transition-transform text-slate-400 ${isJadwalOpen ? 'rotate-180 text-rose-500' : ''}`} />
                </button>
                
                {isJadwalOpen && (
                  <div className="absolute z-50 mt-3 w-full bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-3 overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="max-h-72 overflow-y-auto no-scrollbar">
                      {jadwalList.map((j) => (
                        <button 
                          key={j.id_jadwal} 
                          onClick={() => handleSelectJadwal(j)}
                          className={`w-full flex flex-col p-5 rounded-2xl transition-all text-left group border-b border-slate-50 last:border-0 ${selectedJadwal?.id_jadwal === j.id_jadwal ? 'bg-rose-50' : 'hover:bg-slate-50'}`}
                        >
                          <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedJadwal?.id_jadwal === j.id_jadwal ? 'text-rose-600' : 'text-slate-400'}`}>{j.KodeMK}</span>
                          <span className={`text-sm font-bold uppercase ${selectedJadwal?.id_jadwal === j.id_jadwal ? 'text-rose-700' : 'text-slate-700'}`}>{j.NamaMatkul} — Kelas {j.Kelas}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  placeholder="CARI NAMA / NPM..." 
                  className="w-full pl-16 pr-8 py-5 md:py-6 bg-white border-2 border-slate-100 rounded-[2rem] font-bold text-[11px] md:text-[12px] outline-none focus:border-rose-500 focus:shadow-xl focus:shadow-rose-50 transition-all text-slate-800 placeholder:text-slate-300 uppercase"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="relative min-h-[300px]">
              {loadingContent ? (
                <div className="py-24 flex justify-center">
                  <LoadAnimate userType="dosen" />
                </div>
              ) : selectedJadwal ? (
                <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Mahasiswa</th>
                          {['Sikap', 'Tugas', 'UTS', 'UAS'].map((head) => (
                            <th key={head} className="px-4 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">{head}</th>
                          ))}
                          <th className="px-10 py-8 text-[11px] font-black text-rose-500 uppercase tracking-[0.2em] text-right">Nilai Akhir</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredMahasiswa.length > 0 ? (
                          filteredMahasiswa.map((m, idx) => {
                            const na = ((0.1 * (parseFloat(m.nsikap) || 0)) + (0.3 * (parseFloat(m.ntugas) || 0)) + (0.25 * (parseFloat(m.nuts) || 0)) + (0.35 * (parseFloat(m.nuas) || 0))).toFixed(1);
                            return (
                              <tr key={m.NPM || idx} className="hover:bg-rose-50/30 transition-colors group">
                                <td className="px-10 py-8">
                                  <p className="text-[11px] font-black text-rose-500 mb-1">{m.NPM}</p>
                                  <h4 className="text-[13px] font-black text-slate-800 uppercase leading-none group-hover:text-rose-700 transition-colors">{m.NamaMahasiswa || m.Nama}</h4>
                                </td>
                                {['nsikap', 'ntugas', 'nuts', 'nuas'].map((field) => (
                                  <td key={field} className="px-4 py-8 text-center">
                                    <input 
                                      type="number" 
                                      value={m[field] ?? ""} 
                                      onChange={(e) => handleInputChange(idx, field, e.target.value)} 
                                      className="w-16 h-12 text-center bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-sm outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all" 
                                    />
                                  </td>
                                ))}
                                <td className="px-10 py-8 text-right font-black text-xl text-slate-900 group-hover:text-rose-600 transition-colors">{na}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr><td colSpan={6} className="py-24 text-center text-slate-300 font-black uppercase text-xs tracking-[0.3em]">Data tidak ditemukan</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden divide-y divide-slate-100">
                    {filteredMahasiswa.map((m, idx) => (
                      <div key={m.NPM || idx} className="p-6 space-y-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black text-rose-500 uppercase mb-1">{m.NPM}</p>
                            <h4 className="text-sm font-black text-slate-800 uppercase">{m.NamaMahasiswa || m.Nama}</h4>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black text-rose-500 uppercase mb-1">NA</p>
                            <p className="text-2xl font-black text-slate-900">
                              {((0.1 * (parseFloat(m.nsikap) || 0)) + (0.3 * (parseFloat(m.ntugas) || 0)) + (0.25 * (parseFloat(m.nuts) || 0)) + (0.35 * (parseFloat(m.nuas) || 0))).toFixed(1)}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {[{ l: 'SKP', k: 'nsikap' }, { l: 'TGS', k: 'ntugas' }, { l: 'UTS', k: 'nuts' }, { l: 'UAS', k: 'nuas' }].map((f) => (
                            <div key={f.k} className="space-y-1.5">
                              <label className="text-[9px] font-black text-slate-400 uppercase block text-center">{f.l}</label>
                              <input type="number" value={m[f.k] ?? ""} onChange={(e) => handleInputChange(idx, f.k, e.target.value)} className="w-full h-12 text-center bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-sm outline-none focus:border-rose-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-8 md:p-10 bg-slate-50/80 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center md:text-left italic">
                      Sistem menghitung Nilai Akhir otomatis.
                    </p>
                    <button 
                      onClick={() => setShowConfirmModal(true)}
                      className="w-full md:w-auto flex items-center justify-between md:justify-start gap-6 bg-slate-950 hover:bg-rose-600 text-white pl-10 pr-4 py-4 rounded-[2rem] transition-all active:scale-95 shadow-2xl group"
                    >
                      <span className="text-[11px] font-black uppercase tracking-[0.3em]">Update Nilai</span>
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Save size={20} />
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white py-32 rounded-[3rem] md:rounded-[4rem] border-4 border-dashed border-slate-50 text-center flex flex-col items-center px-10 animate-in fade-in">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                    <GraduationCap size={48} className="text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black uppercase text-slate-300 tracking-[0.3em]">Pilih Mata Kuliah</h3>
                  <p className="text-slate-400 text-[11px] font-bold mt-3 uppercase tracking-widest max-w-[280px] leading-relaxed">Pilih jadwal di atas untuk mengelola nilai mahasiswa</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ModalCustom isOpen={showConfirmModal} variant="warning" title="Update Nilai?" message="Data akan segera disimpan ke database." confirmText={isSaving ? "SAVING..." : "YA, UPDATE"} onClose={() => !isSaving && setShowConfirmModal(false)} onConfirm={handleSimpanNilai} />
      <ModalCustom isOpen={showSuccessModal} variant="success" title="Berhasil!" message="Nilai mahasiswa telah diperbarui." confirmText="TUTUP" onClose={() => setShowSuccessModal(false)} onConfirm={() => setShowSuccessModal(false)} />
    </div>
  );
};

export default InputNilai;