import { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, Award, Calendar, Printer, User } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { DokumenKHS } from '../../components/mhs/DokumenKHS';
import LoadAnimate from '../../components/layout/LoadAnimate';

const CetakKHS = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

  const groupedData = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    data.forEach(item => {
      const key = `${item.TahunAjaran} - ${item.SemesterAkademik}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [data]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `KHS_${selectedPeriod?.replace(/\//g, '-')}`,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${apiBase}/api/mahasiswa/khs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        setData(Array.isArray(result?.data) ? result.data : []);
      } catch (e) {
        setData([]);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchData();
  }, [apiBase]);

  useEffect(() => {
    if (selectedPeriod) {
      handlePrint();
      const timeout = setTimeout(() => setSelectedPeriod(null), 1000);
      return () => clearTimeout(timeout);
    }
  }, [selectedPeriod]);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20 p-2 md:p-0">
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> MAHASISWA
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              CETAK <span className="text-emerald-500 italic">KHS</span>
            </h1>
          </div>
          <div className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Award size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Status Data</p>
              <p className="text-xl font-bold text-white uppercase tracking-tight">
                {data.length > 0 ? 'Data Ready' : 'Standby'}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      {loading ? (
        <div className="py-20">
          <LoadAnimate userType="mahasiswa" duration={800} />
        </div>
      ) : data.length > 0 ? (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 text-white">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{data[0].Nama}</h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{data[0].NPM} • {data[0].Prodi}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="px-10 py-6 border-b border-slate-50 italic text-emerald-500">Periode Akademik</th>
                    <th className="px-10 py-6 border-b border-slate-50 text-center">IP Semester</th>
                    <th className="px-10 py-6 border-b border-slate-50 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {Object.keys(groupedData).map((periodKey) => (
                    <tr key={periodKey} className="group hover:bg-slate-50 transition-all">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-slate-300" />
                          <span className="text-sm font-black uppercase tracking-tight group-hover:text-emerald-600">
                            {periodKey}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className="px-4 py-2 bg-emerald-50 rounded-xl text-[10px] font-black text-emerald-600">
                          TERSEDIA
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => setSelectedPeriod(periodKey)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-100 flex items-center gap-3 ml-auto"
                        >
                          <Printer size={14} /> CETAK KHS
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="hidden">
            {selectedPeriod && (
              <div ref={componentRef}>
                <DokumenKHS 
                  userData={{ Nama: data[0].Nama, NPM: data[0].NPM, Prodi: data[0].Prodi }} 
                  khsData={groupedData[selectedPeriod]} 
                  semesterAkademik={groupedData[selectedPeriod][0].SemesterAkademik}
                  tahunAjaran={groupedData[selectedPeriod][0].TahunAjaran}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white py-32 rounded-[3rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
          <Award size={48} className="text-slate-100 mb-6" />
          <h3 className="text-xl font-black uppercase text-slate-300 tracking-[0.2em]">Data Tidak Ditemukan</h3>
          <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-widest">Belum ada data KHS</p>
        </div>
      )}
    </div>
  );
};

export default CetakKHS;
