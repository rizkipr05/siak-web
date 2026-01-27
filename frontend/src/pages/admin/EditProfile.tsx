import { useEffect, useState } from 'react';
import { Sparkles, Save, User, Mail } from 'lucide-react';
import LoadAnimate from '../../components/layout/LoadAnimate';
import { ModalCustom } from '../../components/layout/ModalCustom';
import { useNavigate } from 'react-router-dom';

const AdminEditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({ nama_admin: '', email: '' });

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiBase}/api/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        const data = result?.data;
        if (data) {
          setForm({ nama_admin: data.nama_admin || '', email: data.email || '' });
        }
      } catch (err) {
        // ignore
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
      const res = await fetch(`${apiBase}/api/admin/profile`, {
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> ADMIN
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Edit <span className="text-indigo-500 italic">Profil</span>
            </h1>
          </div>
          <button onClick={() => navigate('/admin/profile')} className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
            Kembali
          </button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <LoadAnimate userType="staff" duration={800} />
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nama Admin</label>
            <div className="relative">
              <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                required
                value={form.nama_admin}
                onChange={(e) => setForm({ ...form, nama_admin: e.target.value })}
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all disabled:opacity-50">
            <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      )}

      <ModalCustom
        isOpen={showSuccess}
        variant="success"
        title="Berhasil!"
        message="Profil admin berhasil diperbarui."
        confirmText="Kembali"
        onConfirm={() => { setShowSuccess(false); navigate('/admin/profile'); }}
      />
    </div>
  );
};

export default AdminEditProfile;
