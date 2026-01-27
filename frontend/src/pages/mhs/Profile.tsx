import { useEffect, useState } from 'react';
import { Sparkles, User, IdCard, Calendar, GraduationCap, Edit3 } from 'lucide-react';
import LoadAnimate from '../../components/layout/LoadAnimate';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${apiBase}/api/mahasiswa/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        setProfile(result?.data || null);
      } catch (err) {
        console.error(err);
        setProfile(null);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchProfile();
  }, [apiBase]);

  const fotoUrl = profile?.Foto ? `${apiBase}/uploads/${profile.Foto}` : null;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> MAHASISWA
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Profil <span className="text-emerald-500 italic">Mahasiswa</span>
            </h1>
          </div>
          <button
            onClick={() => navigate('/profil-edit')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all"
          >
            <Edit3 size={16} /> Edit Profil
          </button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <LoadAnimate userType="mahasiswa" duration={800} />
        </div>
      ) : !profile ? (
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
                (profile.Nama || 'M').charAt(0)
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Nama</p>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{profile.Nama}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
                <IdCard size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">NPM</p>
                <p className="text-slate-700 font-bold text-sm tracking-tight">{profile.NPM}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Jenis Kelamin</p>
                <p className="text-slate-700 font-bold text-sm tracking-tight">{profile.JenisKelamin || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Tanggal Lahir</p>
                <p className="text-slate-700 font-bold text-sm tracking-tight">{profile.TglLahir || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
                <GraduationCap size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Program Studi</p>
                <p className="text-slate-700 font-bold text-sm tracking-tight">{profile.Prodi || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
