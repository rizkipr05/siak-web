import { useEffect, useState, useMemo, useCallback } from 'react';
import { Search, Layers, Sparkles } from 'lucide-react';
import KRSCard from '../../components/mhs/KRSCard';
import { ModalCustom } from '../../components/layout/ModalCustom';
import LoadAnimate from '../../components/layout/LoadAnimate';

const IsiKRS = () => {
  const [rawMatakuliah, setRawMatakuliah] = useState<any[]>([]);
  const [selectedJadwal, setSelectedJadwal] = useState<any[]>([]);
  const [savedJadwalIds, setSavedJadwalIds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [isSaving, setIsSaving] = useState(false);

  const userData = useMemo(() => {
    const saved = localStorage.getItem('user');
    const parsed = saved ? JSON.parse(saved) : {};
    return { ...parsed, id: parsed.npm || parsed.id }; 
  }, []);

  const userType = useMemo(() => {
    return userData.npm ? 'mahasiswa' : 'dosen';
  }, [userData]);

  const semesterAkademik = useMemo(() => {
    const bulan = new Date().getMonth() + 1;
    return (bulan >= 9 || bulan <= 2) ? 'Ganjil' : 'Genap';
  }, []);

  const tahunAjaran = useMemo(() => {
    const year = new Date().getFullYear();
    const bulan = new Date().getMonth() + 1;
    return bulan >= 9 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  }, []);

  const maxSKS = useMemo(() => {
    const ipk = parseFloat(userData.ipk || "0");
    return ipk >= 3.0 ? 24 : 20;
  }, [userData]);

  const loadData = useCallback(async () => {
    const studentId = userData.id;
    const token = localStorage.getItem('token');
    if (!studentId || !token) return;

    try {
      const [resMK, resKRS] = await Promise.all([
        fetch('http://localhost:5000/api/matkul', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:5000/api/krs/${studentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (resMK.status === 401 || resKRS.status === 401) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      const dataMK = await resMK.json();
      const dataKRS = await resKRS.json();

      if (Array.isArray(dataMK)) {
        setRawMatakuliah(dataMK);
      }
      
      if (dataKRS.success) {
        setSavedJadwalIds(dataKRS.data.map((id: any) => String(id)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userData.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const currentSavedSKS = useMemo(() => {
    const savedMK = rawMatakuliah.filter(m => savedJadwalIds.includes(String(m.id_jadwal)));
    const uniqueSaved = Array.from(new Set(savedMK.map(m => m.KodeMK)))
      .map(kode => savedMK.find(m => m.KodeMK === kode));
    return uniqueSaved.reduce((sum, item) => sum + (item?.SKS || 0), 0);
  }, [rawMatakuliah, savedJadwalIds]);

  const totalSKS = currentSavedSKS + selectedJadwal.reduce((sum, item) => sum + (item.SKS || 0), 0);

  const isMatkulDisabled = (kodeMK: string) => {
    const allIdsForThisMK = rawMatakuliah.filter(m => m.KodeMK === kodeMK).map(m => String(m.id_jadwal));
    return allIdsForThisMK.some(id => savedJadwalIds.includes(id));
  };

  const groupedMatkul = useMemo(() => {
    const groups: any = {};
    rawMatakuliah.forEach(item => {
      if (!groups[item.KodeMK]) {
        groups[item.KodeMK] = { ...item, opsiKelas: [] };
      }
      groups[item.KodeMK].opsiKelas.push({ ...item });
    });
    Object.values(groups).forEach((mk: any) => {
      mk.opsiKelas.sort((a: any, b: any) => a.Kelas.localeCompare(b.Kelas));
    });
    return Object.values(groups);
  }, [rawMatakuliah]);

  const filteredData = useMemo(() => {
    return groupedMatkul.filter((mk: any) => {
      const matchesSearch = mk.NamaMatkul.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeFilter === "Semua" || String(mk.Semester) === activeFilter;
      const isPeriodMatch = semesterAkademik === 'Ganjil' ? mk.Semester % 2 !== 0 : mk.Semester % 2 === 0;
      return matchesSearch && matchesTab && isPeriodMatch;
    });
  }, [groupedMatkul, searchTerm, activeFilter, semesterAkademik]);

  const handlePilihKelas = (jadwal: any, kodeMK: string) => {
    if (isMatkulDisabled(kodeMK)) return;
    const isSelected = selectedJadwal.some(s => String(s.id_jadwal) === String(jadwal.id_jadwal));
    if (isSelected) {
      setSelectedJadwal(selectedJadwal.filter(item => String(item.id_jadwal) !== String(jadwal.id_jadwal)));
      return;
    }
    const targetMK = groupedMatkul.find((m: any) => m.KodeMK === kodeMK) as any;
    if (totalSKS + targetMK.SKS > maxSKS) {
      setShowErrorModal(true);
      return;
    }
    const filtered = selectedJadwal.filter(item => {
      const match = rawMatakuliah.find(r => String(r.id_jadwal) === String(item.id_jadwal));
      return match?.KodeMK !== kodeMK;
    });
    setSelectedJadwal([...filtered, { ...jadwal, SKS: targetMK.SKS }]);
  };

  const handleSimpanKRS = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/krs/simpan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          npm: userData.id,
          jadwal_ids: selectedJadwal.map(j => j.id_jadwal),
          tahunAjaran,
          semesterAkademik
        })
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      const result = await res.json();
      if (result.success) {
        setShowConfirmModal(false);
        setSelectedJadwal([]);
        await loadData();
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsSaving(false); 
    }
  };

  return (
    <div className="w-full space-y-8 pb-40 px-4 md:px-0 animate-in fade-in duration-700">
      
      <div className="relative bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div className="space-y-4 w-full md:w-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
              <Sparkles size={12} className="text-emerald-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/80">
                {semesterAkademik} • {tahunAjaran}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">
              PENGISIAN <span className="inline-block pr-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">KRS</span>
            </h2>
          </div>

          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Progress Beban Studi</p>
                <h4 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-none">
                  {totalSKS}<span className="text-slate-600 mx-1">/</span><span className="text-slate-400">{maxSKS}</span>
                  <span className="text-[10px] md:text-xs text-slate-500 ml-2 uppercase tracking-normal">SKS</span>
                </h4>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <Layers className="text-emerald-400 w-6 h-6 md:w-8 md:h-8" />
              </div>
            </div>
            
            <div className="w-full md:w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-1000 ease-out"
                style={{ width: `${(totalSKS / maxSKS) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative min-h-[500px]">
        {loading ? (
          <LoadAnimate 
            duration={1500} 
            userType={userType} 
            onComplete={() => setLoading(false)} 
          />
        ) : (
          <div className="space-y-8 animate-in zoom-in-95 fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari matakuliah..." 
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold text-sm shadow-sm"
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {["Semua", 1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                  if (sem !== "Semua") {
                     const isMatch = semesterAkademik === 'Ganjil' ? Number(sem) % 2 !== 0 : Number(sem) % 2 === 0;
                     if (!isMatch) return null;
                  }
                  return (
                    <button 
                      key={sem} 
                      onClick={() => setActiveFilter(String(sem))} 
                      className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeFilter === String(sem) ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
                    >
                      {sem === "Semua" ? sem : `Sem. ${sem}`}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredData.map((mk: any) => (
                <KRSCard 
                  key={mk.KodeMK} 
                  mk={mk} 
                  isDisabled={isMatkulDisabled(mk.KodeMK)} 
                  selectedForThisMK={selectedJadwal.some(s => {
                    const match = rawMatakuliah.find(r => String(r.id_jadwal) === String(s.id_jadwal));
                    return match?.KodeMK === mk.KodeMK;
                  })} 
                  handlePilihKelas={handlePilihKelas} 
                  selectedJadwal={selectedJadwal} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedJadwal.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-slate-950/95 backdrop-blur-xl p-3 pl-6 rounded-full shadow-2xl z-50 flex items-center justify-between border border-white/10 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-white font-black text-sm tracking-tight">{totalSKS} SKS Terpilih</p>
          </div>
          <button 
            onClick={() => setShowConfirmModal(true)} 
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
          >
            SIMPAN KRS
          </button>
        </div>
      )}

      <ModalCustom 
        isOpen={showConfirmModal}
        variant="success"
        title="Simpan KRS?"
        message="Mata kuliah akan dijadwalkan ke akun Anda."
        confirmText={isSaving ? "PROSES..." : "YA, SIMPAN"}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSimpanKRS}
      />

      <ModalCustom 
        isOpen={showErrorModal}
        variant="warning"
        title="Batas SKS"
        message={<span>Batas studi Anda adalah {maxSKS} SKS.</span>}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
};

export default IsiKRS;