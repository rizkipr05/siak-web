import { useEffect, useMemo, useState } from 'react';
import { Sparkles, Users, ShieldCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';
import LoadAnimate from '../../components/layout/LoadAnimate';
import { useNavigate } from 'react-router-dom';

const Bimbingan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

  const userData = useMemo(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : {};
  }, []);

  useEffect(() => {
    const fetchBimbingan = async () => {
      const token = localStorage.getItem('token');
      const nidn = userData?.nidn || userData?.id;
      if (!token || !nidn) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${apiBase}/api/dosen/bimbingan/${nidn}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        setList(Array.isArray(result?.data) ? result.data : []);
      } catch (err) {
        console.error(err);
        setList([]);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchBimbingan();
  }, [userData, apiBase]);

  const totalMhs = list.length;
  const totalMenunggu = useMemo(() => list.reduce((acc, cur) => acc + (cur.menunggu || 0), 0), [list]);
  const totalDisetujui = useMemo(() => list.reduce((acc, cur) => acc + (cur.disetujui || 0), 0), [list]);
  const totalDitolak = useMemo(() => list.reduce((acc, cur) => acc + (cur.ditolak || 0), 0), [list]);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> SIAK - DOSEN
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Mahasiswa <span className="text-rose-500 italic">Bimbingan</span>
            </h1>
          </div>
          <div className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-5">
            <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/40">
              <Users size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total Bimbingan</p>
              <p className="text-2xl font-bold text-white leading-tight">
                {totalMhs} <span className="text-xs text-rose-500 uppercase">Mhs</span>
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px]" />
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <LoadAnimate userType="dosen" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menunggu</p>
                <p className="text-2xl font-black text-slate-800">{totalMenunggu}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disetujui</p>
                <p className="text-2xl font-black text-slate-800">{totalDisetujui}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <XCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ditolak</p>
                <p className="text-2xl font-black text-slate-800">{totalDitolak}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Daftar Bimbingan</p>
              </div>
              <button
                onClick={() => navigate('/approval-krs')}
                className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Approval KRS
              </button>
            </div>

            {list.length === 0 ? (
              <div className="py-24 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                Data bimbingan belum ada
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {list.map((m) => (
                  <div key={m.NPM} className="p-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{m.NPM}</p>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{m.Nama}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{m.Prodi || '—'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-2 rounded-xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        Total {m.total_krs || 0}
                      </span>
                      <span className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest">
                        Menunggu {m.menunggu || 0}
                      </span>
                      <span className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                        Setuju {m.disetujui || 0}
                      </span>
                      <span className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest">
                        Tolak {m.ditolak || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Bimbingan;
