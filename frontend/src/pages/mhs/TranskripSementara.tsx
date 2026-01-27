import { useEffect, useMemo, useState } from 'react';
import { Sparkles, FileText, GraduationCap } from 'lucide-react';
import LoadAnimate from '../../components/layout/LoadAnimate';

const TranskripSementara = () => {
  const [data, setData] = useState<any[]>([]);
  const [mahasiswa, setMahasiswa] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiBase}/api/mahasiswa/transkrip-sementara`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        setData(Array.isArray(result.data) ? result.data : []);
        setMahasiswa(result.mahasiswa || null);
      } catch (err) {
        setData([]);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchData();
  }, []);

  const totalSKS = useMemo(() => data.reduce((acc, cur) => acc + (cur.SKS || 0), 0), [data]);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> MAHASISWA
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Transkrip <span className="text-emerald-500 italic">Sementara</span>
            </h1>
          </div>
          <div className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total SKS</p>
              <p className="text-2xl font-bold text-white leading-tight">
                {loading ? '-' : totalSKS} <span className="text-xs text-emerald-500 uppercase">SKS</span>
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <LoadAnimate userType="mahasiswa" duration={800} />
        </div>
      ) : data.length > 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-emerald-500" />
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-700">Rekap Nilai</p>
            </div>
            {mahasiswa && (
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {mahasiswa.Nama} • {mahasiswa.NPM}
              </p>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mata Kuliah</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SKS</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">NA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{item.KodeMK}</p>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.NamaMatkul}</h4>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black">
                        {item.SKS}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center font-black text-slate-900">{Number(item.NA || 0).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white py-32 rounded-[3rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
          <FileText size={48} className="text-slate-100 mb-6" />
          <h3 className="text-xl font-black uppercase text-slate-300 tracking-[0.2em]">Data Tidak Ditemukan</h3>
          <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-widest">Belum ada data nilai</p>
        </div>
      )}
    </div>
  );
};

export default TranskripSementara;
