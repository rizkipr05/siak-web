import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Sparkles, 
  ArrowUpRight, 
  ClipboardCheck, 
  ShieldCheck, 
  Award, 
  Database,
  BookOpen,
  GraduationCap
} from 'lucide-react';

const DashboardStaff = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMahasiswa: 0,
    totalDosen: 0,
    krsPending: 0,
    totalMatkul: 0
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/auth/login-pegawai');
      return;
    }
    setUserData(JSON.parse(savedUser));
    fetchRealStats();
  }, [navigate]);

  const fetchRealStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/stats');
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Mahasiswa', value: stats.totalMahasiswa, icon: <Users size={24} />, color: 'from-blue-600 to-indigo-700', label: 'Mahasiswa Aktif' },
    { title: 'Total Dosen', value: stats.totalDosen, icon: <GraduationCap size={24} />, color: 'from-emerald-500 to-teal-600', label: 'Tenaga Pengajar' },
    { title: 'KRS Pending', value: stats.krsPending, icon: <ClipboardCheck size={24} />, color: 'from-orange-500 to-amber-600', label: 'Perlu Verifikasi' },
    { title: 'Mata Kuliah', value: stats.totalMatkul, icon: <BookOpen size={24} />, color: 'from-rose-500 to-pink-600', label: 'Kurikulum Aktif' },
  ];

  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen">
      {/* Welcome Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3">
            <Sparkles size={12} /> System Administrator
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
            Selamat Datang, <span className="text-indigo-600">{userData?.nama || 'Admin'}</span>!
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Pantau dan kelola data akademik universitas dalam satu dasbor.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <ShieldCheck size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Akses</p>
                <p className="font-bold text-slate-700 uppercase tracking-tight">{userData?.role || 'Staff'}</p>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => (
          <div key={i} className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-[0.03] rounded-bl-full group-hover:scale-110 transition-transform`} />
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100`}>
              {card.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{card.title}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{loading ? '...' : card.value}</h3>
              <span className="text-[10px] font-bold text-slate-400 mb-1">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Profil Administrasi</h3>
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><ArrowUpRight size={20}/></button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Username / ID', value: userData?.id, icon: <FileText size={18}/> },
                { label: 'Nama Lengkap', value: userData?.nama, icon: <Users size={18}/> },
                { label: 'Status Kepegawaian', value: 'Aktif', icon: <Award size={18}/> },
                { label: 'Database Node', value: 'Production-01', icon: <Database size={18}/> }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-50 hover:border-indigo-100 transition-colors">
                  <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm">{item.icon}</div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{item.label}</p>
                    <p className="text-sm font-black text-slate-700 uppercase">{item.value || '-'}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
        
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
            <Sparkles className="absolute top-10 right-10 opacity-20" size={80} />
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Pusat Bantuan</h3>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Gunakan menu sidebar untuk mengelola data master, mencetak laporan, atau memverifikasi berkas mahasiswa.</p>
            <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg">Panduan Penggunaan</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardStaff;
