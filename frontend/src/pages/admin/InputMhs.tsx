import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Save, Trash2, Edit3, Search, 
  Loader2, Users, Camera
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadAnimate from '../../components/layout/LoadAnimate'; 
import { ModalCustom } from '../../components/layout/ModalCustom';

const InputMhs = () => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    NPM: '', Nama: '', JenisKelamin: 'L', TglLahir: '',
    Prodi: '', NIDN_Wali: '', password: ''
  });
  const [mhsList, setMhsList] = useState<any[]>([]);
  const [dosenList, setDosenList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 
  const [actionLoading, setActionLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');

  // Penambahan State untuk Foto
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'success' as 'success' | 'danger' | 'warning',
    onConfirm: undefined as (() => void) | undefined
  });

  const normalizeJK = (value: any) => {
    const v = (value || '').toString().trim().toLowerCase();
    if (v === 'l' || v === 'laki-laki' || v === 'laki laki') return 'L';
    if (v === 'p' || v === 'perempuan') return 'P';
    return value || '';
  };

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      const resMhs = await fetch('http://localhost:5000/api/admin/master/mahasiswa', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataMhs = await resMhs.json();
      const resDsn = await fetch('http://localhost:5000/api/admin/master/dosen', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataDsn = await resDsn.json();
      
      if (dataMhs.success) setMhsList(dataMhs.data);
      if (dataDsn.success) setDosenList(dataDsn.data);
    } catch (err) { 
      toast.error("Gagal sinkronisasi database");
    } finally {
      setTimeout(() => setLoading(false), 1200); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- FOTO LOGIC ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // --- CRUD LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    // Menggunakan FormData agar bisa mengirim file
    const data = new FormData();
    data.append('NPM', formData.NPM);
    data.append('Nama', formData.Nama);
    data.append('JenisKelamin', normalizeJK(formData.JenisKelamin) || 'L');
    data.append('TglLahir', formData.TglLahir);
    data.append('Prodi', formData.Prodi);
    data.append('NIDN_Wali', formData.NIDN_Wali);
    data.append('password', formData.password);
    if (selectedFile) data.append('foto', selectedFile);

    try {
      const url = isEdit 
        ? `http://localhost:5000/api/admin/master/mahasiswa/${formData.NPM}`
        : 'http://localhost:5000/api/admin/master/mahasiswa';
      
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data // Body dikirim sebagai FormData
      });
      
      const result = await res.json();
      if (result.success) {
        setModal({
          isOpen: true,
          title: isEdit ? "Update Berhasil" : "Data Tersimpan",
          message: `Mahasiswa ${formData.Nama} telah berhasil diproses.`,
          variant: 'success',
          onConfirm: undefined
        });
        resetForm();
        fetchData();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Kesalahan koneksi server");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (mhs: any) => {
    setIsEdit(true);
    setFormData({
      NPM: mhs.NPM,
      Nama: mhs.Nama,
      JenisKelamin: normalizeJK(mhs.JenisKelamin) || 'L',
      TglLahir: mhs.TglLahir ? new Date(mhs.TglLahir).toISOString().split('T')[0] : '',
      Prodi: mhs.Prodi || '',
      NIDN_Wali: mhs.NIDN_Wali || '',
      password: '' 
    });
    setPreviewUrl(mhs.Foto ? `http://localhost:5000/uploads/${mhs.Foto}` : null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const executeDelete = async (npm: string) => {
    setModal({ ...modal, isOpen: false });
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/master/mahasiswa/${npm}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Data telah dihapus");
        fetchData();
      }
    } catch (err) { toast.error("Gagal menghapus"); }
    finally { setActionLoading(false); }
  };

  const confirmDelete = (mhs: any) => {
    setModal({
      isOpen: true,
      title: "Hapus Data?",
      message: `Hapus ${mhs.Nama}? Data tidak dapat dikembalikan.`,
      variant: 'danger',
      onConfirm: () => executeDelete(mhs.NPM)
    });
  };

  const resetForm = () => {
    setFormData({ NPM: '', Nama: '', JenisKelamin: 'L', TglLahir: '', Prodi: '', NIDN_Wali: '', password: '' });
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEdit(false);
  };

  const filteredMhs = mhsList.filter(m => 
    m.Nama?.toLowerCase().includes(searchTerm.toLowerCase()) || m.NPM?.includes(searchTerm)
  );

  return (
    <div className="w-full space-y-8 pb-20">
      <ModalCustom 
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        variant={modal.variant}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
      />

      {/* HEADER */}
      <div className="bg-slate-950 p-10 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> MASTER DATABASE
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              DATA <span className="text-indigo-500 italic">MAHASISWA</span>
            </h1>
          </div>
          <div className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
                {actionLoading ? <Loader2 className="animate-spin text-white" size={24} /> : <Users className="text-white" size={24} />}
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Status</p>
              <p className="text-xl font-bold text-white uppercase tracking-tight">Management</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* AREA KONTEN */}
      <div className="relative min-h-[500px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadAnimate userType="staff" duration={1200} />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* FORM ENTRI */}
            <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
                  <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight italic flex items-center gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          Formulir Pendaftaran
                      </h2>
                      {isEdit && <button type="button" onClick={resetForm} className="text-[10px] font-black text-rose-500 border-b-2 border-rose-500/20 uppercase">Batal Edit</button>}
                  </div>

                  {/* Bagian Input Foto & Data Utama */}
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Area Upload Foto */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-32 h-32 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center group relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        {previewUrl ? (
                          <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <Camera className="text-slate-300 group-hover:scale-110 transition-transform" size={32} />
                        )}
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Foto Profil 1:1</p>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">NPM</label>
                            <input required disabled={isEdit} type="text" value={formData.NPM} onChange={e => setFormData({...formData, NPM: e.target.value})} className="w-full bg-slate-50 border-0 px-6 py-4 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-100 outline-none disabled:opacity-50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap</label>
                            <input required type="text" value={formData.Nama} onChange={e => setFormData({...formData, Nama: e.target.value})} className="w-full bg-slate-50 border-0 px-6 py-4 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-100 outline-none uppercase" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Program Studi</label>
                            <select required value={formData.Prodi} onChange={e => setFormData({...formData, Prodi: e.target.value})} className="w-full bg-slate-50 border-0 px-6 py-4 rounded-2xl text-xs font-bold outline-none">
                                <option value="">Pilih Program Studi</option>
                                <option value="Teknik Informatika">Teknik Informatika</option>
                                <option value="Sistem Informasi">Sistem Informasi</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Dosen Wali</label>
                            <select required value={formData.NIDN_Wali} onChange={e => setFormData({...formData, NIDN_Wali: e.target.value})} className="w-full bg-slate-50 border-0 px-6 py-4 rounded-2xl text-xs font-bold outline-none">
                                <option value="">Pilih Dosen</option>
                                {dosenList.map(d => <option key={d.NIDN} value={d.NIDN}>{d.Nama}</option>)}
                            </select>
                        </div>
                    </div>
                  </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl space-y-6 flex flex-col justify-between border border-white/5">
                  <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">Security</h3>
                      <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Password</label>
                          <input required={!isEdit} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-xs font-bold outline-none focus:border-indigo-500 transition-all" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <select value={formData.JenisKelamin} onChange={e => setFormData({...formData, JenisKelamin: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-[10px] font-bold outline-none">
                              <option value="L" className="bg-slate-900">Laki-laki</option>
                              <option value="P" className="bg-slate-900">Perempuan</option>
                          </select>
                          <input type="date" value={formData.TglLahir} onChange={e => setFormData({...formData, TglLahir: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-[10px] font-bold outline-none" />
                      </div>
                  </div>
                  <button type="submit" disabled={actionLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-500/20">
                      {actionLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                      {isEdit ? 'Update Mahasiswa' : 'Simpan Data'}
                  </button>
              </div>
            </form>

            {/* TABEL LIST */}
            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Basis Data Mahasiswa</h2>
                  <div className="relative w-full md:w-96">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="text" placeholder="Cari data..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-50 pl-14 pr-6 py-4 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-50 transition-all" />
                  </div>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead>
                          <tr className="bg-slate-50/50">
                              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mahasiswa</th>
                              <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Prodi</th>
                              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tindakan</th>
                          </tr>
                      </thead>
                     <tbody className="divide-y divide-slate-50">
                        {filteredMhs.map((m) => (
                            <tr key={m.NPM} className="hover:bg-indigo-50/20 transition-all group">
                            <td className="px-10 py-6 flex items-center gap-4">
                                {/* Thumbnail Foto Mahasiswa */}
                                <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm group-hover:border-indigo-200 transition-colors">
                                <img 
                                    src={
                                    // Logika: Jika Foto ada dan bukan placeholder default dari DB
                                    m.Foto && m.Foto !== "default_mhs.jpg" 
                                        ? `http://localhost:5000/uploads/${m.Foto}` 
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(m.Nama)}&background=random&color=fff`
                                    } 
                                    alt={m.Nama}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    onError={(e) => {
                                    // Jika file di server (misal milik Zamiel) tidak ditemukan, balik ke inisial
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null; // Mencegah looping error
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.Nama)}&background=6366f1&color=fff`;
                                    }}
                                />
                                </div>

                                <div>
                                <p className="font-black text-slate-800 text-sm uppercase tracking-tight">{m.Nama}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                    {m.NPM} • <span className={m.JenisKelamin === 'L' ? 'text-blue-500' : 'text-rose-500'}>{m.JenisKelamin}</span>
                                </p>
                                </div>
                            </td>

                            <td className="px-6 py-6 text-center">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase italic tracking-tighter">
                                {m.Prodi}
                                </span>
                            </td>

                            <td className="px-10 py-6">
                                <div className="flex justify-center gap-3">
                                <button 
                                    type="button"
                                    onClick={() => handleEdit(m)} 
                                    className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm active:scale-95"
                                    title="Edit Data"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => confirmDelete(m)} 
                                    className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
                                    title="Hapus Data"
                                >
                                    <Trash2 size={16} />
                                </button>
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                  </table>
              </div>
            </div>  
          </div>
        )}
      </div>
    </div>
  );
};

export default InputMhs;
