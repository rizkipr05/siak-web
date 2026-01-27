import { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Search, Printer, Sparkles, GraduationCap, 
  FileText, Loader2, User, Calendar,
  PrinterCheck, ChevronRight
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { DokumenKRS } from '../../components/mhs/DokumenKRS';
import LoadAnimate from '../../components/layout/LoadAnimate'; // Import LoadAnimate

const CetakKRS = () => {
  const [npm, setNpm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // State loading awal
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('token');

  // Loading awal selama 1 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
    documentTitle: `KRS_${npm}_${selectedYear?.replace(/\//g, '-')}`,
  });

  const handleSelectAndPrint = (yearKey: string) => {
    setSelectedYear(yearKey);
  };

  // Trigger print setelah selectedYear berubah
  useEffect(() => {
    if (selectedYear) {
      handlePrint();
    }
  }, [selectedYear]);

  const fetchData = async () => {
    if (!npm) return;
    setLoading(true);
    setHasSearched(true);
    setSelectedYear(null);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/reports/krs?npm=${npm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setData(result.data);
      else setData([]);
    } catch (e) {
      setData([]);
    } finally {
      // Simulasi loading content agar halus
      setTimeout(() => setLoading(false), 800);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20 p-2 md:p-0">
      
      {/* HEADER SECTION */}
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> PRINT SERVICE
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              CETAK <span className="text-indigo-500 italic">KRS</span>
            </h1>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <PrinterCheck size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Status</p>
              <p className="text-xl font-bold text-white uppercase tracking-tight">
                {data.length > 0 ? 'Ready' : 'Idle'}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {isInitialLoading ? (
        <div className="py-20">
          <LoadAnimate userType="staff" duration={1000} />
        </div>
      ) : (
        <>
          {/* SEARCH BAR */}
          <div className="flex flex-col md:flex-row gap-4 bg-slate-50 p-3 rounded-[2.5rem] border border-slate-100 shadow-inner">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                placeholder="MASUKKAN NPM MAHASISWA..." 
                className="w-full bg-white border-0 pl-16 pr-8 py-5 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
              />
            </div>
            <button 
              onClick={fetchData}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-100 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              CARI DATA
            </button>
          </div>

          {/* CONTENT AREA */}
          <div className="relative min-h-[400px]">
            {loading ? (
              <div className="py-20">
                <LoadAnimate userType="staff" duration={800} />
              </div>
            ) : data.length > 0 ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
                {/* TABLE LIST */}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
                  <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 text-white">
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
                          <th className="px-10 py-6 border-b border-slate-50 italic text-indigo-500">Periode Akademik</th>
                          <th className="px-10 py-6 border-b border-slate-50 text-center">Beban SKS</th>
                          <th className="px-10 py-6 border-b border-slate-50 text-right">Opsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700">
                        {Object.keys(groupedData).map((yearKey) => (
                          <tr key={yearKey} className="group hover:bg-slate-50 transition-all">
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-3">
                                <Calendar size={16} className="text-slate-300" />
                                <span className="text-sm font-black uppercase tracking-tight group-hover:text-indigo-600">
                                  {yearKey}
                                </span>
                              </div>
                            </td>
                            <td className="px-10 py-8 text-center">
                              <span className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500">
                                {groupedData[yearKey].reduce((sum, item) => sum + (Number(item.SKS) || 0), 0)} SKS
                              </span>
                            </td>
                            <td className="px-10 py-8 text-right">
                              <button 
                                onClick={() => handleSelectAndPrint(yearKey)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-100 flex items-center gap-3 ml-auto"
                              >
                                <Printer size={14} /> CETAK KRS
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* HIDDEN PRINT COMPONENT */}
                <div className="hidden">
                  {selectedYear && (
                    <div ref={componentRef}>
                      <DokumenKRS 
                        userData={{ nama: data[0].Nama, id: data[0].NPM, prodi: data[0].Prodi }} 
                        krsData={groupedData[selectedYear]} 
                        totalSKS={groupedData[selectedYear].reduce((sum, item) => sum + (Number(item.SKS) || 0), 0)}
                        semesterAkademik={groupedData[selectedYear][0].SemesterAkademik}
                        tahunAjaran={groupedData[selectedYear][0].TahunAjaran}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : hasSearched ? (
              <div className="bg-white py-40 rounded-[4rem] border-4 border-dashed border-slate-50 text-center flex flex-col items-center">
                <GraduationCap size={48} className="text-slate-200 mb-6" />
                <h3 className="text-2xl font-black uppercase text-slate-300 tracking-[0.3em]">Tidak Ditemukan</h3>
                <p className="text-slate-400 text-[11px] font-bold mt-2 uppercase tracking-widest max-w-[280px]">NPM tidak terdaftar atau data KRS belum tersedia.</p>
              </div>
            ) : (
              <div className="bg-white py-40 rounded-[4rem] border-4 border-dashed border-slate-50 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8 shadow-inner text-indigo-200">
                  <FileText size={40} />
                </div>
                <h3 className="text-2xl font-black uppercase text-slate-300 tracking-[0.3em]">Cari Mahasiswa</h3>
                <p className="text-slate-400 text-[11px] font-bold mt-2 uppercase tracking-widest max-w-[280px]">Masukkan NPM untuk memproses pencetakan dokumen KRS.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CetakKRS;
