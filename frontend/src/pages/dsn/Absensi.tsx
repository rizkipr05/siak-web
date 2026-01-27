import { useState, useEffect, useMemo } from 'react';
import { 
  UserCheck, 
  Search, 
  Sparkles, 
  ChevronDown, 
  ArrowRight, 
  Users, 
  CalendarDays, 
  Lock, 
  Edit3,
  CheckCircle2 
} from 'lucide-react';
import { ModalCustom } from '../../components/layout/ModalCustom';
import LoadAnimate from '../../components/layout/LoadAnimate';

const Absensi = () => {
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [pertemuanList, setPertemuanList] = useState<any[]>([]);
  const [mahasiswa, setMahasiswa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  
  const [isJadwalOpen, setIsJadwalOpen] = useState(false);
  const [isPertemuanOpen, setIsPertemuanOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedJadwal, setSelectedJadwal] = useState<any>(null);
  const [selectedPertemuan, setSelectedPertemuan] = useState<any>(null);
  const [presensi, setPresensi] = useState<Record<string, string>>({});
  
  const [isLocked, setIsLocked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const inputHeight = "h-[72px]";

  const userData = useMemo(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : {};
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const startTime = Date.now();
      const token = localStorage.getItem('token');
      if (userData && token) {
        try {
          const res = await fetch(`http://localhost:5000/api/dosen/jadwal/${userData.id || userData.nidn}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          setJadwalList(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { 
          const duration = Date.now() - startTime;
          setTimeout(() => setLoading(false), Math.max(0, 1000 - duration));
        }
      }
    };
    fetchInitialData();
  }, [userData]);

  const handleSelectJadwal = async (jadwal: any) => {
    setLoadingContent(true); // Mulai loading content
    setSelectedJadwal(jadwal);
    setSelectedPertemuan(null);
    setIsJadwalOpen(false);
    setIsLocked(false);
    setIsEditing(false);
    setPresensi({});
    
    const token = localStorage.getItem('token');
    try {
      const resP = await fetch(`http://localhost:5000/api/dosen/pertemuan-list/${jadwal.id_jadwal}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataP = await resP.json();
      setPertemuanList(dataP);

      const resM = await fetch(`http://localhost:5000/api/dosen/mahasiswa-list/${jadwal.id_jadwal}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataM = await resM.json();
      setMahasiswa(dataM);
    } catch (err) { console.error(err); }
    finally {
      setTimeout(() => setLoadingContent(false), 800);
    }
  };

  const handleSelectPertemuan = async (p: any) => {
    setLoadingContent(true);
    setSelectedPertemuan(p);
    setIsPertemuanOpen(false);
    setIsEditing(false);
    
    const token = localStorage.getItem('token');
    const idPertemuan = p.id_pertemuan || p.id_log || p.ID;

    try {
      const res = await fetch(`http://localhost:5000/api/dosen/absensi/cek/${idPertemuan}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();

      const newPresensi: Record<string, string> = {};
      if (result.exists || result.hasData) {
        const dataArray = result.data || [];
        dataArray.forEach((row: any) => {
          newPresensi[row.NPM || row.npm] = row.Status || row.status_hadir;
        });
        setPresensi(newPresensi);
        setIsLocked(true);
      } else {
        mahasiswa.forEach((m: any) => {
          newPresensi[m.NPM || m.npm] = 'H';
        });
        setPresensi(newPresensi);
        setIsLocked(false);
      }
    } catch (err) { console.error(err); }
    finally {
      setTimeout(() => setLoadingContent(false), 500);
    }
  };

  const updateStatus = (npm: string, status: string) => {
    if (isLocked) return;
    setPresensi(prev => ({ ...prev, [npm]: status }));
  };

  const filteredMhs = useMemo(() => {
    return mahasiswa.filter(m => {
      const nama = (m.Nama || m.nama || "").toLowerCase();
      const npm = (m.NPM || m.npm || "");
      return nama.includes(searchTerm.toLowerCase()) || npm.includes(searchTerm);
    });
  }, [mahasiswa, searchTerm]);

  const handleSimpan = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('token');
    const idPertemuan = selectedPertemuan?.id_pertemuan || selectedPertemuan?.id_log || selectedPertemuan?.ID;

    try {
      const res = await fetch('http://localhost:5000/api/dosen/absensi/simpan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ id_pertemuan: idPertemuan, data_absensi: presensi })
      });

      if (res.ok) {
        setShowConfirmModal(false);
        setShowUpdateModal(false);
        setShowSuccessModal(true);
        setIsLocked(true);
        setIsEditing(false);
      }
    } catch (err) { console.error(err); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700 pb-10">
      
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> SIAK - Dosen
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Presensi <span className="text-rose-500 italic">Mahasiswa</span>
            </h1>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-5">
            <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/40">
              <Users size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total Mhs</p>
              <p className="text-xl font-bold text-white leading-tight">
                {mahasiswa.length} Orang
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative min-h-100">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <LoadAnimate userType="dosen" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="relative">
                <button onClick={() => setIsJadwalOpen(!isJadwalOpen)} 
                  className={`w-full ${inputHeight} flex items-center justify-between px-6 rounded-2xl font-bold text-sm bg-white border-2 border-slate-100 uppercase transition-all ${isJadwalOpen ? 'border-rose-500 shadow-xl shadow-rose-50' : 'text-slate-700'}`}>
                  <span className="truncate">{selectedJadwal ? (selectedJadwal.NamaMatakuliah || selectedJadwal.NamaMatkul) : "Pilih Matakuliah"}</span>
                  <ChevronDown size={18} className={`transition-transform text-slate-400 ${isJadwalOpen ? 'rotate-180 text-rose-500' : ''}`} />
                </button>
                {isJadwalOpen && (
                  <div className="absolute z-50 mt-3 w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 max-h-64 overflow-y-auto no-scrollbar">
                    {jadwalList.map((j) => (
                        <button key={j.id_jadwal} onClick={() => handleSelectJadwal(j)} 
                          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all mb-1 group ${selectedJadwal?.id_jadwal === j.id_jadwal ? 'bg-rose-50 text-rose-600 font-black' : 'hover:bg-slate-50 text-slate-700 font-bold'}`}>
                          <span className="text-xs uppercase tracking-tight">{j.NamaMatakuliah || j.NamaMatkul} — {j.Kelas}</span>
                          {selectedJadwal?.id_jadwal === j.id_jadwal && <CheckCircle2 size={18} className="text-rose-500 animate-in zoom-in" />}
                        </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button disabled={!selectedJadwal} onClick={() => setIsPertemuanOpen(!isPertemuanOpen)} 
                  className={`w-full ${inputHeight} flex items-center justify-between px-6 rounded-2xl font-bold text-sm bg-white border-2 border-slate-100 uppercase transition-all disabled:opacity-50 ${isPertemuanOpen ? 'border-rose-500 shadow-xl shadow-rose-50' : 'text-slate-700'}`}>
                  {selectedPertemuan ? `Sesi Ke-${selectedPertemuan.pertemuan_ke || selectedPertemuan.PertemuanKe}` : "Pilih Sesi"}
                  <ChevronDown size={18} className={`transition-transform text-slate-400 ${isPertemuanOpen ? 'rotate-180 text-rose-500' : ''}`} />
                </button>
                {isPertemuanOpen && (
                  <div className="absolute z-50 mt-3 w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 max-h-64 overflow-y-auto no-scrollbar">
                    {pertemuanList.map((p, idx) => (
                        <button key={idx} onClick={() => handleSelectPertemuan(p)} 
                          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all mb-1 uppercase ${selectedPertemuan?.ID === p.ID ? 'bg-rose-50 text-rose-600 font-black' : 'hover:bg-slate-50 text-slate-800 font-bold'}`}>
                          <span className="text-xs">Sesi {p.pertemuan_ke || p.PertemuanKe}</span>
                          {selectedPertemuan?.ID === p.ID && <CheckCircle2 size={18} className="text-rose-600 animate-in zoom-in" />}
                        </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="text" placeholder="CARI NAMA MAHASISWA..." 
                  className={`w-full ${inputHeight} pl-16 pr-6 bg-white border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none uppercase focus:border-rose-500 focus:shadow-xl focus:shadow-rose-50 transition-all text-slate-800 placeholder:text-slate-300 placeholder:font-medium`} 
                  onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="relative min-h-75">
              {loadingContent ? (
                <div className="py-20">
                  <LoadAnimate userType="dosen" />
                </div>
              ) : selectedJadwal && selectedPertemuan ? (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  {isLocked && (
                    <div className="flex items-center justify-between bg-rose-50 border border-rose-100 p-4 px-8 rounded-2xl">
                      <div className="flex items-center gap-3 text-rose-700">
                        <Lock size={16} /><p className="text-[10px] font-black uppercase tracking-widest">Data Kehadiran Terkunci</p>
                      </div>
                      <button onClick={() => { setIsLocked(false); setIsEditing(true); }} 
                        className="flex items-center gap-2 bg-white text-rose-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-sm border border-rose-100 hover:bg-rose-600 hover:text-white transition-all">
                        <Edit3 size={14} /> Edit Data
                      </button>
                    </div>
                  )}

                  <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-500 ${isLocked ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'}`}>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="p-8 text-[11px] font-black text-slate-950 uppercase tracking-widest pl-12">Mahasiswa</th>
                          <th className="p-8 text-[11px] font-black text-slate-950 uppercase tracking-widest text-center">Status Kehadiran</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredMhs.map((m) => {
                          const mNPM = m.NPM || m.npm;
                          return (
                            <tr key={mNPM} className="hover:bg-slate-50/30 transition-colors group">
                              <td className="p-6 pl-12">
                                <div className="flex items-center gap-5">
                                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 uppercase">
                                    {(m.Nama || m.nama)?.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-black text-rose-500 uppercase tracking-widest leading-none mb-1.5">{mNPM}</p>
                                    <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight">{m.Nama || m.nama}</h3>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6">
                                <div className={`flex justify-center gap-3 ${isLocked ? 'pointer-events-none' : ''}`}>
                                  {['H', 'S', 'I', 'A'].map((s) => (
                                    <button key={s} onClick={() => updateStatus(mNPM, s)} 
                                      className={`w-12 h-12 rounded-xl text-[11px] font-black transition-all duration-300 border-2 ${presensi[mNPM] === s ? 'bg-rose-600 border-transparent text-white shadow-lg shadow-rose-200' : 'bg-white border-slate-100 text-slate-400 hover:border-rose-200'}`}>
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                      <CalendarDays className="text-slate-200" size={32} />
                    </div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Tentukan matakuliah & sesi</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!isLocked && selectedPertemuan && filteredMhs.length > 0 && !loadingContent && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-slate-950/90 backdrop-blur-xl p-3 pl-8 rounded-full shadow-2xl z-50 flex items-center justify-between border border-white/10 animate-in slide-in-from-bottom-10 duration-700">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-600/40">
              <UserCheck size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-[10px] uppercase leading-none mb-1">Simpan Absensi</p>
              <p className="text-rose-300 font-bold text-[9px] uppercase tracking-widest leading-none italic">Sesi {selectedPertemuan.pertemuan_ke || selectedPertemuan.PertemuanKe}</p>
            </div>
          </div>
          <button onClick={() => isEditing ? setShowUpdateModal(true) : setShowConfirmModal(true)} 
            className="bg-rose-600 hover:bg-rose-500 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-rose-600/30 group flex items-center gap-2">
            {isEditing ? 'PERBARUI' : 'SIMPAN'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      <ModalCustom isOpen={showConfirmModal} variant="warning" title="Simpan Kehadiran?" message="Data absen akan disimpan dan sesi akan segera dikunci." confirmText={isSaving ? "MENYIMPAN..." : "YA, SIMPAN"} onClose={() => !isSaving && setShowConfirmModal(false)} onConfirm={handleSimpan} />
      <ModalCustom isOpen={showUpdateModal} variant="warning" title="Perbarui Kehadiran?" message="Perubahan pada daftar hadir ini akan menggantikan data lama." confirmText={isSaving ? "MEMPERBARUI..." : "YA, PERBARUI"} onClose={() => !isSaving && setShowUpdateModal(false)} onConfirm={handleSimpan} />
      <ModalCustom isOpen={showSuccessModal} variant="success" title="Berhasil Disimpan" message="Data kehadiran mahasiswa telah berhasil diperbarui." confirmText="SAYA MENGERTI" onConfirm={() => setShowSuccessModal(false)} />
    </div>
  );
};

export default Absensi;