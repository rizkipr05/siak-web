import { useEffect, useState } from 'react';
import { Sparkles, Save, User, IdCard, Award, MapPin, Phone } from 'lucide-react';
import LoadAnimate from '../../components/layout/LoadAnimate';
import { ModalCustom } from '../../components/layout/ModalCustom';
import { useNavigate } from 'react-router-dom';

const DosenEditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    NIDN: '',
    Nama: '',
    Gelar: '',
    JenisKelamin: '',
    Alamat: '',
    NoHP: ''
  });

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiBase}/api/dosen/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        const data = result?.data;
        if (data) {
          setForm({
            NIDN: data.NIDN || '',
            Nama: data.Nama || '',
            Gelar: data.Gelar || '',
            JenisKelamin: data.JenisKelamin || '',
            Alamat: data.Alamat || '',
            NoHP: data.NoHP || ''
          });
        }
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/dosen/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (res.ok && result.success) setShowSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-8 pb-10">
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> DOSEN
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Edit <span className="text-rose-500 italic">Profil</span>
            </h1>
          </div>
          <button onClick={() => navigate('/dosen/profile')} className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
            Kembali
          </button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px]" />
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <LoadAnimate userType="dosen" duration={800} />
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">NIDN</label>
              <div className="relative">
                <IdCard size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input value={form.NIDN} onChange={(e) => setForm({ ...form, NIDN: e.target.value })} className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-rose-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nama</label>
              <div className="relative">
                <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input required value={form.Nama} onChange={(e) => setForm({ ...form, Nama: e.target.value })} className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-rose-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Gelar</label>
              <div className="relative">
                <Award size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input value={form.Gelar} onChange={(e) => setForm({ ...form, Gelar: e.target.value })} className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-rose-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Jenis Kelamin</label>
              <select value={form.JenisKelamin} onChange={(e) => setForm({ ...form, JenisKelamin: e.target.value })} className="w-full h-14 px-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-rose-500">
                <option value="">Pilih</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Alamat</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input value={form.Alamat} onChange={(e) => setForm({ ...form, Alamat: e.target.value })} className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-rose-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No HP</label>
              <div className="relative">
                <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input value={form.NoHP} onChange={(e) => setForm({ ...form, NoHP: e.target.value })} className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-rose-500" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={isSaving} className="w-full bg-rose-600 hover:bg-rose-500 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all disabled:opacity-50">
            <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      )}

      <ModalCustom
        isOpen={showSuccess}
        variant="success"
        title="Berhasil!"
        message="Profil dosen berhasil diperbarui."
        confirmText="Kembali"
        onConfirm={() => { setShowSuccess(false); navigate('/dosen/profile'); }}
      />
    </div>
  );
};

export default DosenEditProfile;
