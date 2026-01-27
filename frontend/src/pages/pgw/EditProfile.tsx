import { useEffect, useState } from 'react';
import { Sparkles, Save, User, IdCard, Briefcase, Users } from 'lucide-react';
import LoadAnimate from '../../components/layout/LoadAnimate';
import { ModalCustom } from '../../components/layout/ModalCustom';
import { useNavigate } from 'react-router-dom';

const PegawaiEditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({ NIP: '', Nama: '', Jabatan: '', JenisKelamin: '' });

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiBase}/api/staff/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        const data = result?.data;
        if (data) {
          setForm({
            NIP: data.NIP || '',
            Nama: data.Nama || '',
            Jabatan: data.Jabatan || '',
            JenisKelamin: data.JenisKelamin || ''
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
      const res = await fetch(`${apiBase}/api/staff/profile`, {
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> PEGAWAI
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Edit <span className="text-emerald-500 italic">Profil</span>
            </h1>
          </div>
          <button onClick={() => navigate('/pegawai/profile')} className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
            Kembali
          </button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <LoadAnimate userType="staff" duration={800} />
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">NIP</label>
              <div className="relative">
                <IdCard size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input value={form.NIP} onChange={(e) => setForm({ ...form, NIP: e.target.value })} className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nama</label>
              <div className="relative">
                <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input required value={form.Nama} onChange={(e) => setForm({ ...form, Nama: e.target.value })} className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Jabatan</label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input value={form.Jabatan} onChange={(e) => setForm({ ...form, Jabatan: e.target.value })} className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Jenis Kelamin</label>
              <div className="relative">
                <Users size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <select value={form.JenisKelamin} onChange={(e) => setForm({ ...form, JenisKelamin: e.target.value })} className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-emerald-500">
                  <option value="">Pilih</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>
          </div>
          <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all disabled:opacity-50">
            <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      )}

      <ModalCustom
        isOpen={showSuccess}
        variant="success"
        title="Berhasil!"
        message="Profil pegawai berhasil diperbarui."
        confirmText="Kembali"
        onConfirm={() => { setShowSuccess(false); navigate('/pegawai/profile'); }}
      />
    </div>
  );
};

export default PegawaiEditProfile;
