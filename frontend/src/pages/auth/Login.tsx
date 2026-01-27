import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, User, Sparkles, GraduationCap } from 'lucide-react';
import UnikaLogo from '../../assets/unika.png';
import { ModalCustom } from '../../components/layout/ModalCustom'; // Sesuaikan path-nya

const Login = () => {
  const navigate = useNavigate();
  const [isDosen, setIsDosen] = useState(false);
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    variant: 'danger' as 'danger' | 'success' | 'warning'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          password,
          role: isDosen ? 'dosen' : 'mahasiswa'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); 
        navigate('/dashboard', { replace: true });
      } else {
        setModalContent({
          title: 'Gagal Masuk',
          message: data.message || 'ID atau Kata Sandi yang Anda masukkan salah. Silahkan cek kembali data Anda.',
          variant: 'danger' // Pakai warna merah sesuai config modalmu
        });
        setModalOpen(true);
      }
    } catch (error) {
      setModalContent({
        title: 'Kesalahan Sistem',
        message: 'Tidak dapat terhubung ke server. Pastikan API backend sudah dijalankan.',
        variant: 'warning' // Pakai warna orange/peringatan
      });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = () => {
    setIsDosen(!isDosen);
    setIdentifier('');
    setPassword('');
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-x-hidden">
      
      <ModalCustom 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
        variant={modalContent.variant}
        confirmText="Coba Lagi"
      />

      <div className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[80px] transition-colors duration-1000 ${isDosen ? 'bg-rose-100' : 'bg-emerald-100'}`} />
      <div className={`absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-[80px] transition-colors duration-1000 ${isDosen ? 'bg-rose-100' : 'bg-emerald-100'}`} />

      <div className="w-full max-w-90 md:max-w-110 perspective-[2000px] z-10">
        <div className={`relative w-full min-h-140 md:min-h-155 transition-all duration-1000 transform-3d ${isDosen ? 'transform-[rotateY(180deg)]' : ''}`}>
          
          <div className="absolute inset-0 w-full h-full bg-white border border-slate-200 rounded-[2.5rem] shadow-xl backface-hidden flex flex-col overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
            <div className="p-7 md:p-10 flex flex-col h-full justify-between">
              <div className="text-center space-y-3">
                <img src={UnikaLogo} alt="Unika" className="h-12 md:h-16 w-auto mx-auto object-contain" />
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1.5">
                    <Sparkles size={10} /> SIAK - STUDENT
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter italic">Portal <span className="text-emerald-500 not-italic">Akademik</span></h2>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-3.5 md:space-y-4 mt-2">
                <div className="space-y-1">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">NPM Mahasiswa</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="NPM ANDA"
                      className="w-full pl-11 pr-4 py-3 md:py-4 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 uppercase text-xs md:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Kata Sandi</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 md:py-4 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 text-xs md:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Ingat Saya</span>
                  </label>
                  <button type="button" className="text-emerald-600 hover:text-emerald-700 font-black text-[9px] md:text-[10px] uppercase tracking-widest">Lupa Sandi?</button>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 md:py-4.5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 active:scale-[0.97] transition-all disabled:opacity-50 mt-2">
                  {loading ? 'MEMPROSES...' : 'MASUK'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-50 space-y-3">
                <button type="button" onClick={toggleRole} className="w-full group flex items-center justify-center gap-3 py-3 px-4 bg-slate-50 hover:bg-rose-50 rounded-xl transition-all border border-slate-100 hover:border-rose-100">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-600 text-center">
                    Masuk sebagai <span className="text-rose-500 font-black">Dosen</span>
                  </span>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                </button>
                <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                  <a href="/auth/login-pegawai" className="hover:text-slate-700 transition-colors">Pegawai</a>
                  <span>•</span>
                  <a href="/auth/login-admin" className="hover:text-indigo-600 transition-colors">Admin</a>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 w-full h-full bg-white border border-slate-200 rounded-[2.5rem] shadow-xl backface-hidden transform-[rotateY(180deg)] flex flex-col overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-600"></div>
            <div className="p-7 md:p-10 flex flex-col h-full justify-between">
              <div className="text-center space-y-3">
                <img src={UnikaLogo} alt="Unika" className="h-12 md:h-16 w-auto mx-auto object-contain" />
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1.5">
                    <GraduationCap size={10} /> SIAK - DOSEN
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter italic">Portal <span className="text-rose-600 not-italic">Pengajar</span></h2>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-3.5 md:space-y-4 mt-2">
                <div className="space-y-1">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">NIDN / Username</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                    <input 
                      type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="NIDN ANDA"
                      className="w-full pl-11 pr-4 py-3 md:py-4 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-rose-500 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 uppercase text-xs md:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Kata Sandi</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                    <input 
                      type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 md:py-4 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-rose-500 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 text-xs md:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
                    <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-rose-600 transition-colors">Ingat Saya</span>
                  </label>
                  <button type="button" className="text-rose-600 hover:text-rose-700 font-black text-[9px] md:text-[10px] uppercase tracking-widest">Lupa Sandi?</button>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 md:py-4.5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-lg shadow-rose-100 active:scale-[0.97] transition-all disabled:opacity-50 mt-2">
                  {loading ? 'MEMVERIFIKASI...' : 'MASUK'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-50">
                <button type="button" onClick={toggleRole} className="w-full group flex items-center justify-center gap-3 py-3 px-4 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 hover:border-emerald-100">
                  <ArrowRight size={14} className="text-slate-300 rotate-180 group-hover:text-emerald-500 group-hover:-translate-x-1 transition-all" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 text-center">
                    Masuk sebagai <span className="text-emerald-500 font-black">Mahasiswa</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
