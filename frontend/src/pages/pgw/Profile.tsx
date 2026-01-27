import { useEffect, useState } from 'react';
import { Sparkles, User, IdCard, Briefcase, Users, Edit3 } from 'lucide-react';
import LoadAnimate from '../../components/layout/LoadAnimate';
import { useNavigate } from 'react-router-dom';

const PegawaiProfile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiBase}/api/staff/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        setData(result.data || null);
      } catch (err) {
        setData(null);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchProfile();
  }, []);

  const fotoUrl = data?.Foto ? `${apiBase}/uploads/${data.Foto}` : null;

  return (
    <div className="w-full space-y-8 pb-10">
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> PEGAWAI
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Profil <span className="text-emerald-500 italic">Pegawai</span>
            </h1>
          </div>
          <button
            onClick={() => navigate('/pegawai/profile/edit')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
          >
            <Edit3 size={14} /> Edit Profil
          </button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <LoadAnimate userType="staff" duration={800} />
        </div>
      ) : !data ? (
        <div className="bg-white py-24 rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Profil tidak ditemukan</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-10 space-y-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl text-white flex items-center justify-center shadow-lg shadow-emerald-200 uppercase font-black text-2xl overflow-hidden">
              {fotoUrl ? (
                <img src={fotoUrl} alt="Profil" className="h-full w-full object-cover" />
              ) : (
                (data.Nama || 'P').charAt(0)
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Nama</p>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{data.Nama}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
                <IdCard size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">NIP</p>
                <p className="text-slate-700 font-bold text-sm tracking-tight">{data.NIP}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Username</p>
                <p className="text-slate-700 font-bold text-sm tracking-tight">{data.username}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
                <Briefcase size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Jabatan</p>
                <p className="text-slate-700 font-bold text-sm tracking-tight">{data.Jabatan || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
                <Users size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Jenis Kelamin</p>
                <p className="text-slate-700 font-bold text-sm tracking-tight">{data.JenisKelamin || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PegawaiProfile;
