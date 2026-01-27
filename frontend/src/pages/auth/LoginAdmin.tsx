import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ChevronRight } from 'lucide-react';
import UnikaLogo from '../../assets/unika.png';
import { ModalCustom } from '../../components/layout/ModalCustom';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const role: 'admin' = 'admin';
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    variant: 'danger' as 'danger' | 'success' | 'warning'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) navigate('/dashboard', { replace: true });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); 
        navigate('/dashboard', { replace: true });
      } else {
        setModalContent({
          title: 'Akses Ditolak',
          message: data.message || 'Username atau Password salah.',
          variant: 'danger'
        });
        setModalOpen(true);
      }
    } catch (error) {
      setModalContent({
        title: 'Server Error',
        message: 'Gagal terhubung ke server backend.',
        variant: 'warning'
      });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-4 bg-[#f8fafc] relative overflow-hidden">
      <ModalCustom 
        isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={modalContent.title} message={modalContent.message}
        variant={modalContent.variant} confirmText="Coba Lagi"
      />

      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-20 transition-colors duration-700 bg-indigo-600" />

      <div className="w-full max-w-100 z-10">
        <div className="bg-white border border-slate-200 rounded-4xl shadow-2xl shadow-slate-200/50 overflow-hidden">
          
          <div className="p-8 pb-4 text-center">
            <img src={UnikaLogo} alt="Logo" className="h-14 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              Admin <span className="text-indigo-600">Access</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Sistem Informasi Administrasi</p>
          </div>

          <div className="px-8 mb-6">
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl flex items-center justify-center gap-2 text-indigo-600">
              <ShieldCheck size={16} />
              <span className="text-[11px] font-black uppercase tracking-wider">Login Admin</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="px-8 pb-10 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-indigo-500" size={18} />
                <input 
                  type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="USERNAME ANDA"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white outline-none transition-all font-bold text-slate-800 text-sm focus:border-current"
                  style={{ color: '#4f46e5' }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-indigo-500" size={18} />
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white outline-none transition-all font-bold text-slate-800 text-sm focus:border-current"
                  style={{ color: '#4f46e5' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-lg transition-all active:scale-[0.98] mt-4 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
            >
              {loading ? 'MEMPROSES...' : (
                <>
                  MASUK SISTEM <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

        </div>
        
        <p className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          Internal Use Only • &copy; 2024 UNIKA
        </p>
      </div>
    </div>
  );
};

export default LoginAdmin;
