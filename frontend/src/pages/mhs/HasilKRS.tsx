import { useEffect, useState, useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, GraduationCap, Layers, Trash2, Calendar, Sparkles, User, FileText } from 'lucide-react';
import { ModalCustom } from '../../components/layout/ModalCustom';
import { DokumenKRS } from '../../components/mhs/DokumenKRS';

const HasilKRS = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [krsData, setKrsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState<{ show: boolean; id: string | null }>({
    show: false,
    id: null,
  });

  const userData = useMemo(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : {};
  }, []);

  const userNPM = userData.id || userData.username;

  const semesterAkademik = useMemo(() => {
    const bulan = new Date().getMonth() + 1;
    return (bulan >= 9 || bulan <= 2) ? 'Ganjil' : 'Genap';
  }, []);

  const tahunAjaran = useMemo(() => {
    const year = new Date().getFullYear();
    const bulan = new Date().getMonth() + 1;
    return bulan >= 9 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `KRS_${userNPM}`,
  });

  const loadKRS = async () => {
    if (!userNPM) return;
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/krs/my-krs/${userNPM}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      const data = await response.json();
      setKrsData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => { loadKRS(); }, [userNPM]);

  const totalSKS = useMemo(() => krsData.reduce((acc, curr) => acc + (curr.SKS || 0), 0), [krsData]);

  const handleDelete = async () => {
    if (!showDeleteModal.id) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/krs/hapus/${userNPM}/${showDeleteModal.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      const result = await res.json();
      if (result.success) {
        setShowDeleteModal({ show: false, id: null });
        loadKRS();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Sinkronisasi Data...</p>
    </div>
  );

  return (
    <div className="w-full space-y-8 pb-40 px-4 md:px-0 animate-in fade-in duration-700">
      
      <div className="relative bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/10 to-transparent"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-[80px]"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
              <Sparkles size={12} className="text-emerald-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/80">
                Tahun Akademik {tahunAjaran}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">
              HASIL <span className="inline-block pr-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">KRS</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total SKS Diambil</p>
              <h4 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">
                {totalSKS} <span className="text-xs text-slate-600">SKS</span>
              </h4>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hidden md:block">
              <Layers className="text-emerald-400 w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {krsData.length > 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mata Kuliah</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SKS</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Kelas</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dosen Pengampu</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {krsData.map((item, index) => (
                  <tr key={index} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{item.KodeMK}</p>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.NamaMatkul}</h4>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black">
                        {item.SKS}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="w-9 h-9 mx-auto rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-700">
                        {item.Kelas}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                          <User size={14} className="text-emerald-600" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight leading-tight">
                          {item.NamaDosen || 'Dosen Pengampu'}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setShowDeleteModal({ show: true, id: item.id_jadwal })}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
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
          <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-widest">Silahkan lakukan pengisian KRS terlebih dahulu</p>
        </div>
      )}

      {krsData.length > 0 && (
        <div className="flex justify-end pt-4">
           <button 
            onClick={handlePrint}
            className="flex items-center gap-4 bg-slate-900 hover:bg-emerald-600 text-white pl-8 pr-3 py-3 rounded-2xl shadow-xl transition-all group active:scale-95"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cetak Dokumen Resmi</span>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Printer size={18} />
            </div>
          </button>
        </div>
      )}

      <ModalCustom
        isOpen={showDeleteModal.show}
        variant="danger"
        title="Batalkan Matakuliah?"
        message="Mata kuliah ini akan dihapus dari rencana studi Anda untuk semester ini."
        confirmText="YA, HAPUS"
        onClose={() => setShowDeleteModal({ show: false, id: null })}
        onConfirm={handleDelete}
      />

      <div className="hidden">
        <DokumenKRS 
          ref={componentRef} 
          krsData={krsData} 
          userData={userData} 
          totalSKS={totalSKS}
          semesterAkademik={semesterAkademik}
          tahunAjaran={tahunAjaran}
        />
      </div>

    </div>
  );
};

export default HasilKRS;