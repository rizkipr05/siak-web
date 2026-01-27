import { useState, useEffect, useRef } from 'react';
import { 
  Send, Calendar, Sparkles, ChevronDown, CalendarDays,
  PenTool, CheckCircle2, AlertCircle, Clock, BookOpen
} from 'lucide-react';
import { ModalCustom } from '../../components/layout/ModalCustom';
import LoadAnimate from '../../components/layout/LoadAnimate';

const Pertemuan = () => {
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [pertemuanEksis, setPertemuanEksis] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [isJadwalOpen, setIsJadwalOpen] = useState(false);
  const [isWaktuOpen, setIsWaktuOpen] = useState(false);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false); 
  const [isSaving, setIsSaving] = useState(false);

  const jadwalRef = useRef<HTMLDivElement>(null);
  const waktuRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    id_jadwal: '', 
    display_name: '',
    pertemuan_ke: '', 
    hari: '', 
    tanggal: new Date().toISOString().split('T')[0], 
    jam_mulai: '', 
    jam_selesai: '', 
    topik: '', 
    deskripsi: '',
    label_waktu: '-- Pilih Sesi --',
    selected_label: ''
  });

  const getHariIndo = (dateString: string) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, hari: getHariIndo(prev.tanggal) }));
  }, [formData.tanggal]);

  const opsiWaktu = [
    { label: "AB", mulai: "08:00", selesai: "09:40" },
    { label: "ABC", mulai: "08:00", selesai: "10:30" },
    { label: "CD", mulai: "09:50", selesai: "11:30" },
    { label: "CDE", mulai: "09:50", selesai: "12:20" },
    { label: "DE", mulai: "10:40", selesai: "12:20" },
    { label: "DEF", mulai: "10:40", selesai: "13:10" },
    { label: "EF", mulai: "11:40", selesai: "13:20" },
    { label: "GH", mulai: "14:00", selesai: "15:40" },
    { label: "GHI", mulai: "14:00", selesai: "16:30" },
    { label: "IJ", mulai: "15:50", selesai: "17:30" },
    { label: "JK", mulai: "16:40", selesai: "18:20" },
    { label: "JKL", mulai: "16:40", selesai: "19:10" },
  ];

  const fetchHistory = async (idJadwal: string) => {
    setIsFetchingHistory(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/dosen/pertemuan-list/${idJadwal}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPertemuanEksis(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      setPertemuanEksis([]);
    } finally {
      setIsFetchingHistory(false);
    }
  };

  useEffect(() => {
    if (formData.id_jadwal) fetchHistory(formData.id_jadwal);
    else setPertemuanEksis([]);
  }, [formData.id_jadwal]);

  useEffect(() => {
    const fetchJadwal = async () => {
      const startTime = Date.now();
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token'); 
      if (!savedUser || !token) return setLoading(false);
      
      const user = JSON.parse(savedUser);
      const nidn = user.nidn || user.id;
      
      try {
        const response = await fetch(`http://localhost:5000/api/dosen/jadwal/${nidn}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setJadwalList(Array.isArray(data) ? data : (data.data || []));
      } catch (error) { 
        console.error(error); 
      } finally {
        const duration = Date.now() - startTime;
        setTimeout(() => setLoading(false), Math.max(0, 1000 - duration));
      }
    };
    fetchJadwal();
  }, []);

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_jadwal || !formData.jam_mulai) return;
    const isDuplicate = pertemuanEksis.some(p => p.pertemuan_ke.toString() === formData.pertemuan_ke.toString());
    if (isDuplicate) setShowWarningModal(true);
    else setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/dosen/pertemuan/simpan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          ...formData, 
          jam_mulai: `${formData.jam_mulai}:00`, 
          jam_selesai: `${formData.jam_selesai}:00` 
        })
      });
      if (res.ok) {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      } else {
        const result = await res.json();
        alert(result.message || "Gagal menyimpan data");
        setShowConfirmModal(false);
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER SECTION - Selalu Muncul */}
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> SIAK - DOSEN
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Log <span className="text-rose-500 italic">Pertemuan</span>
            </h1>
          </div>
          <div className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-5">
            <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/40">
              <CalendarDays size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Hari Ini</p>
              <p className="text-xl font-bold text-white leading-tight">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px]" />
      </div>

      {/* KONTEN AREA DENGAN LOADING SENDIRI */}
      <div className="relative min-h-[500px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadAnimate userType="dosen" />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* FORM */}
            <form onSubmit={handlePreSubmit} className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-visible">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-slate-100">
                  <div className="p-8 md:p-10 space-y-8 flex flex-col">
                    <div className="flex items-center gap-3 text-rose-500 border-b border-slate-50 pb-4">
                      <PenTool size={20} />
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Detail Materi</h3>
                    </div>
                    <div className="space-y-2.5" ref={jadwalRef}>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mata Kuliah & Kelas</label>
                      <div className="relative">
                        <button type="button" onClick={() => setIsJadwalOpen(!isJadwalOpen)} className={`w-full h-[72px] flex items-center justify-between px-6 rounded-2xl font-bold text-sm border-2 transition-all ${isJadwalOpen ? 'bg-white border-rose-50 shadow-xl' : 'bg-slate-50 border-transparent text-slate-700'}`}>
                          <span className={formData.display_name ? 'text-slate-900 uppercase font-black tracking-tight' : 'text-slate-400 italic'}>{formData.display_name || "-- Pilih Jadwal Mengajar --"}</span>
                          <ChevronDown size={20} className={isJadwalOpen ? 'rotate-180 text-rose-500' : 'text-slate-400'} />
                        </button>
                        {isJadwalOpen && (
                          <div className="absolute z-[60] mt-2 w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 max-h-60 overflow-y-auto no-scrollbar">
                            {jadwalList.map((j) => (
                              <button key={j.id_jadwal} type="button" onClick={() => { setFormData({...formData, id_jadwal: j.id_jadwal, display_name: `${j.NamaMatkul} — ${j.Kelas}`}); setIsJadwalOpen(false); }} className={`w-full flex items-center justify-between p-4 rounded-xl transition-all mb-1 ${formData.id_jadwal === j.id_jadwal ? 'bg-rose-50 text-rose-600' : 'hover:bg-slate-50 text-slate-700'}`}>
                                <span className="text-[11px] uppercase tracking-tight font-bold">{j.NamaMatkul} — {j.Kelas}</span>
                                {formData.id_jadwal === j.id_jadwal && <CheckCircle2 size={18} className="text-rose-500" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Topik Pembahasan</label>
                      <input required type="text" className="w-full h-[72px] px-6 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-rose-500 outline-none transition-all" value={formData.topik} onChange={e => setFormData({ ...formData, topik: e.target.value })} />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Rangkuman Materi</label>
                      <textarea className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] font-medium text-slate-700 h-44 focus:bg-white focus:border-rose-500 outline-none transition-all resize-none" value={formData.deskripsi} onChange={e => setFormData({ ...formData, deskripsi: e.target.value })} />
                    </div>
                  </div>
                  <div className="p-8 md:p-10 space-y-8 bg-slate-50/30 flex flex-col">
                    <div className="flex items-center gap-3 text-rose-500 border-b border-slate-100/50 pb-4">
                      <Calendar size={20} />
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Waktu & Sesi</h3>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block text-left">Pertemuan Ke</label>
                      <input required type="number" className="w-full h-[72px] bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-3xl px-8 focus:border-rose-500 outline-none shadow-sm" value={formData.pertemuan_ke} onChange={e => setFormData({ ...formData, pertemuan_ke: e.target.value })} />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block text-left">Tanggal Pelaksanaan <span className="text-rose-500 ml-2 font-black italic">({formData.hari})</span></label>
                      <input required type="date" className="w-full h-[72px] px-6 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 text-sm focus:border-rose-500 outline-none shadow-sm transition-all" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
                    </div>
                    <div className="space-y-2.5" ref={waktuRef}>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 block text-left">Sesi Perkuliahan (Waktu)</label>
                      <div className="relative">
                        <button type="button" onClick={() => setIsWaktuOpen(!isWaktuOpen)} className={`w-full h-[72px] flex items-center justify-between px-6 rounded-2xl font-black text-sm border-2 transition-all ${isWaktuOpen ? 'bg-white border-rose-500 shadow-lg' : 'bg-white border-slate-100 text-slate-700 shadow-sm'}`}>
                          <span>{formData.label_waktu}</span>
                          <ChevronDown size={20} className={isWaktuOpen ? 'rotate-180 text-rose-500' : 'text-slate-400'} />
                        </button>
                        {isWaktuOpen && (
                          <div className="absolute z-[60] bottom-full mb-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 max-h-52 overflow-y-auto no-scrollbar">
                            {opsiWaktu.map((o) => (
                              <button key={o.label} type="button" onClick={() => { setFormData({...formData, label_waktu: `${o.label} : ${o.mulai} - ${o.selesai}`, jam_mulai: o.mulai, jam_selesai: o.selesai, selected_label: o.label}); setIsWaktuOpen(false); }} className={`w-full flex items-center gap-4 p-4 rounded-xl mb-1 ${formData.selected_label === o.label ? 'bg-rose-50' : 'hover:bg-rose-50/50'}`}>
                                <span className={`w-10 h-8 flex items-center justify-center rounded-lg text-[10px] font-black ${formData.selected_label === o.label ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{o.label}</span>
                                <span className={`text-xs grow text-left ${formData.selected_label === o.label ? 'font-black text-rose-600' : 'font-bold'}`}>{o.mulai} — {o.selesai}</span>
                                {formData.selected_label === o.label && <CheckCircle2 size={16} className="text-rose-500" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pt-4 mt-auto">
                      <button type="submit" className="w-full bg-rose-600 shadow-2xl shadow-rose-200 hover:bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 transition-all active:scale-[0.98] group">Simpan Pertemuan <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* RIWAYAT */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden h-full min-h-[550px] flex flex-col border border-white/5">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <BookOpen size={20} className="text-rose-500" />
                    <div><h3 className="text-xs font-black uppercase tracking-[0.2em]">Riwayat Log</h3><p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Sesi Terdaftar</p></div>
                  </div>
                  {isFetchingHistory && <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>}
                </div>
                <div className="flex-1">
                  {!formData.id_jadwal ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-5 opacity-50"><BookOpen className="text-slate-500" size={32} /><p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Pilih Mata Kuliah untuk <br/> sinkronisasi riwayat</p></div>
                  ) : pertemuanEksis.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-5"><AlertCircle className="text-rose-500" size={32} /><p className="text-[10px] text-slate-500 font-bold uppercase">Mata kuliah ini belum memiliki log pertemuan.</p></div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                      {pertemuanEksis.map((p, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-[2rem] hover:bg-white/10 transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col"><span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Pertemuan</span><span className="text-2xl font-black text-white italic leading-none">{p.pertemuan_ke}</span></div>
                            <span className="text-[9px] font-black bg-white/10 px-3 py-1 rounded-full text-slate-300 uppercase tracking-tighter">{p.tanggal ? new Date(p.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '-'}</span>
                          </div>
                          <h4 className="text-[11px] font-bold text-slate-200 mb-3 uppercase italic line-clamp-2">{p.topik || 'Tanpa Topik'}</h4>
                          <div className="flex items-center gap-2 pt-3 border-t border-white/5 opacity-60"><Clock size={10} className="text-rose-500" /><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p.jam_mulai?.slice(0,5)} — {p.jam_selesai?.slice(0,5)} WIB</p></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ModalCustom isOpen={showWarningModal} variant="danger" title="Duplikasi" message={`Sesi ${formData.pertemuan_ke} sudah ada.`} confirmText="SAYA MENGERTI" onClose={() => setShowWarningModal(false)} />
      <ModalCustom isOpen={showConfirmModal} variant="warning" title="Konfirmasi" message="Simpan data?" confirmText={isSaving ? "PROSES..." : "YA, SIMPAN"} onClose={() => !isSaving && setShowConfirmModal(false)} onConfirm={handleConfirmSave} />
      <ModalCustom isOpen={showSuccessModal} variant="success" title="Berhasil" message="Data tersimpan." confirmText="OK" onConfirm={() => window.location.reload()} />
    </div>
  );
};

export default Pertemuan;