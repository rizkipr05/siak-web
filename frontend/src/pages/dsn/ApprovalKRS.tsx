import { useEffect, useMemo, useState } from 'react';
import { Sparkles, ClipboardCheck, Search, Users } from 'lucide-react';
import LoadAnimate from '../../components/layout/LoadAnimate';
import { ModalCustom } from '../../components/layout/ModalCustom';

const ApprovalKRS = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [selectedNpm, setSelectedNpm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ open: boolean; status: 'Disetujui' | 'Ditolak' | null }>({
    open: false,
    status: null
  });

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

  const userData = useMemo(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : {};
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, any>();
    rows.forEach((r) => {
      const npm = r.NPM;
      if (!map.has(npm)) {
        map.set(npm, { npm, nama: r.Nama, prodi: r.Prodi, items: [] });
      }
      map.get(npm).items.push(r);
    });
    return Array.from(map.values());
  }, [rows]);

  const filteredGroups = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return grouped.filter((g) => {
      return g.npm.toLowerCase().includes(term) || (g.nama || '').toLowerCase().includes(term);
    });
  }, [grouped, searchTerm]);

  const selectedGroup = filteredGroups.find((g) => g.npm === selectedNpm) || filteredGroups[0] || null;

  useEffect(() => {
    if (selectedGroup && selectedGroup.npm !== selectedNpm) {
      setSelectedNpm(selectedGroup.npm);
    }
  }, [selectedGroup, selectedNpm]);

  const fetchPending = async () => {
    const token = localStorage.getItem('token');
    const nidn = userData?.nidn || userData?.id;
    if (!token || !nidn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/dosen/bimbingan-krs/${nidn}?status=menunggu`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      setRows(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      console.error(err);
      setRows([]);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [userData, apiBase]);

  const handleConfirm = async () => {
    if (!selectedGroup || !confirmAction.status) return;
    setIsSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiBase}/api/dosen/bimbingan-krs/approval`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ npm: selectedGroup.npm, status: confirmAction.status })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setConfirmAction({ open: false, status: null });
        await fetchPending();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> SIAK - DOSEN
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Approval <span className="text-rose-500 italic">KRS</span>
            </h1>
          </div>
          <div className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-5">
            <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/40">
              <ClipboardCheck size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Pengajuan</p>
              <p className="text-2xl font-bold text-white leading-tight">
                {rows.length} <span className="text-xs text-rose-500 uppercase">Item</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <Users size={18} className="text-rose-500" />
              <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Mahasiswa</p>
            </div>
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari NPM / Nama..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-[11px] font-bold uppercase tracking-widest outline-none focus:border-rose-500"
                />
              </div>
            </div>
            <div className="max-h-[520px] overflow-y-auto custom-scrollbar">
              {filteredGroups.length === 0 ? (
                <div className="py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  Tidak ada pengajuan
                </div>
              ) : (
                filteredGroups.map((g: any) => (
                  <button
                    key={g.npm}
                    onClick={() => setSelectedNpm(g.npm)}
                    className={`w-full text-left px-5 py-4 border-b border-slate-50 transition-all ${
                      selectedGroup?.npm === g.npm ? 'bg-rose-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{g.npm}</p>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{g.nama}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{g.items.length} MK</p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail KRS</p>
                <p className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  {selectedGroup ? `${selectedGroup.nama} — ${selectedGroup.npm}` : 'Pilih mahasiswa'}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  disabled={!selectedGroup || isSaving}
                  onClick={() => setConfirmAction({ open: true, status: 'Ditolak' })}
                  className="px-4 py-3 rounded-2xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                >
                  Tolak
                </button>
                <button
                  disabled={!selectedGroup || isSaving}
                  onClick={() => setConfirmAction({ open: true, status: 'Disetujui' })}
                  className="px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                >
                  Setujui
                </button>
              </div>
            </div>

            {!selectedGroup ? (
              <div className="py-24 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
                Pilih mahasiswa di kiri
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mata Kuliah</th>
                      <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SKS</th>
                      <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Kelas</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dosen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedGroup.items.map((item: any, idx: number) => (
                      <tr key={`${item.id_krs}-${idx}`} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-5">
                          <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">{item.KodeMK}</p>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.NamaMatkul}</p>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black">
                            {item.SKS}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <div className="w-9 h-9 mx-auto rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-700">
                            {item.Kelas}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{item.NamaDosen || '—'}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <ModalCustom
        isOpen={confirmAction.open}
        variant={confirmAction.status === 'Disetujui' ? 'success' : 'danger'}
        title={confirmAction.status === 'Disetujui' ? 'Setujui KRS?' : 'Tolak KRS?'}
        message="Keputusan ini akan diterapkan ke seluruh item KRS mahasiswa ini."
        confirmText={isSaving ? 'Menyimpan...' : (confirmAction.status === 'Disetujui' ? 'YA, SETUJUI' : 'YA, TOLAK')}
        onClose={() => !isSaving && setConfirmAction({ open: false, status: null })}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default ApprovalKRS;
