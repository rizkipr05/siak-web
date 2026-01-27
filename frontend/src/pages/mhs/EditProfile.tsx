import { useEffect, useState } from 'react';
import { Sparkles, Save, User, Calendar, GraduationCap, Lock, ImageUp } from 'lucide-react';
import LoadAnimate from '../../components/layout/LoadAnimate';
import { ModalCustom } from '../../components/layout/ModalCustom';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    Nama: '',
    JenisKelamin: '',
    TglLahir: '',
    Prodi: '',
    password: ''
  });

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
        const data = result?.data;
        if (data) {
          setForm({
            Nama: data.Nama || '',
            JenisKelamin: data.JenisKelamin || '',
            TglLahir: data.TglLahir ? data.TglLahir.split('T')[0] : '',
            Prodi: data.Prodi || '',
            password: ''
          });
          if (data.Foto) {
            setPhotoUrl(`${apiBase}/uploads/${data.Foto}`);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchProfile();
  }, [apiBase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/mahasiswa/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('foto', photoFile);
      const res = await fetch(`${apiBase}/api/mahasiswa/profile/photo`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const result = await res.json();
      if (res.ok && result.success && result.data?.Foto) {
        const newUrl = `${apiBase}/uploads/${result.data.Foto}`;
        setPhotoUrl(newUrl);
        setPhotoPreview(null);
        setPhotoFile(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> MAHASISWA
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Edit <span className="text-emerald-500 italic">Profil</span>
            </h1>
          </div>
          <button
            onClick={() => navigate('/profil')}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            Kembali
          </button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <LoadAnimate userType="mahasiswa" duration={800} />
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-10 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-emerald-600 rounded-2xl text-white flex items-center justify-center shadow-lg shadow-emerald-200 uppercase font-black text-2xl overflow-hidden">
              {photoPreview || photoUrl ? (
                <img src={photoPreview || photoUrl || ''} alt="Profil" className="h-full w-full object-cover" />
              ) : (
                form.Nama?.charAt(0) || 'M'
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Foto Profil</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setPhotoFile(file);
                  setPhotoPreview(file ? URL.createObjectURL(file) : null);
                }}
                className="text-[10px] font-bold uppercase tracking-widest"
              />
              <button
                type="button"
                disabled={!photoFile || isUploading}
                onClick={handleUploadPhoto}
                className="w-fit bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
              >
                <ImageUp size={14} /> {isUploading ? 'Mengunggah...' : 'Upload Foto'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nama</label>
              <div className="relative">
                <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  required
                  value={form.Nama}
                  onChange={(e) => setForm({ ...form, Nama: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Jenis Kelamin</label>
              <select
                value={form.JenisKelamin}
                onChange={(e) => setForm({ ...form, JenisKelamin: e.target.value })}
                className="w-full h-14 px-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-emerald-500"
              >
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tanggal Lahir</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="date"
                  value={form.TglLahir}
                  onChange={(e) => setForm({ ...form, TglLahir: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Program Studi</label>
              <div className="relative">
                <GraduationCap size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  value={form.Prodi}
                  onChange={(e) => setForm({ ...form, Prodi: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Password Baru (Opsional)</label>
            <div className="relative">
              <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-emerald-500"
                placeholder="Biarkan kosong jika tidak ingin mengubah"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            >
              <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}

      <ModalCustom
        isOpen={showSuccess}
        variant="success"
        title="Berhasil!"
        message="Profil berhasil diperbarui."
        confirmText="Kembali"
        onConfirm={() => { setShowSuccess(false); navigate('/profil'); }}
      />
    </div>
  );
};

export default EditProfile;
