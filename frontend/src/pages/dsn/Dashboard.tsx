import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText, 
  GraduationCap, 
  LayoutGrid, 
  Sparkles, 
  ArrowUpRight,
  ClipboardCheck,
  ShieldCheck,
  User,
  Award 
} from 'lucide-react';

const InfoRow = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-4 group/row text-left py-1">
    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover/row:bg-rose-600 group-hover/row:text-white transition-all duration-300">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5 group-hover/row:text-rose-500">
        {label}
      </p>
      <p className="text-slate-700 font-bold text-sm tracking-tight">{value}</p>
    </div>
  </div>
);

const DashboardDosen = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [stats, setStats] = useState<{ totalSKS: number; totalMahasiswa: number }>({
    totalSKS: 0,
    totalMahasiswa: 0
  });

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!savedUser || !token) {
      navigate('/', { replace: true });
      return;
    }
    setUserData(JSON.parse(savedUser));
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!userData?.nidn && !userData?.id) return;
      const token = localStorage.getItem('token');
      if (!token) return;
      setLoadingDashboard(true);
      try {
        const nidn = userData.nidn || userData.id;
        const res = await fetch(`${apiBase}/api/dosen/dashboard/${nidn}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        const data = result?.data || {};
        setStats({
          totalSKS: data.totalSKS || 0,
          totalMahasiswa: data.totalMahasiswa || 0
        });
        setJadwalList(Array.isArray(data.jadwal) ? data.jadwal : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDashboard(false);
      }
    };
    fetchDashboard();
  }, [userData, apiBase]);

  const parseStartTime = (jam: string) => {
    if (!jam) return { label: '--:--', minutes: null };
    const match = jam.match(/(\d{1,2})[:.](\d{2})/);
    if (!match) return { label: jam, minutes: null };
    const hours = Math.min(23, Math.max(0, parseInt(match[1], 10)));
    const mins = Math.min(59, Math.max(0, parseInt(match[2], 10)));
    const label = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    return { label, minutes: hours * 60 + mins };
  };

  const hariIndex = (hari: string) => {
    const map: Record<string, number> = {
      Minggu: 0,
      Senin: 1,
      Selasa: 2,
      Rabu: 3,
      Kamis: 4,
      Jumat: 5,
      Sabtu: 6
    };
    return map[hari] ?? null;
  };

  const nextSchedule = useMemo(() => {
    if (jadwalList.length === 0) return null;
    const nowDay = currentTime.getDay();
    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    let best: any = null;
    let bestDiff = Infinity;

    for (const item of jadwalList) {
      const dayIdx = hariIndex(item.Hari);
      if (dayIdx === null) continue;
      const start = parseStartTime(item.Jam);
      const startMinutes = start.minutes ?? 0;
      let diffDay = dayIdx - nowDay;
      if (diffDay < 0) diffDay += 7;
      let diffMinutes = diffDay * 1440 + (diffDay === 0 ? startMinutes - nowMinutes : startMinutes);
      if (diffMinutes < 0) diffMinutes += 7 * 1440;
      if (diffMinutes < bestDiff) {
        bestDiff = diffMinutes;
        best = { ...item, _startLabel: start.label };
      }
    }
    return best;
  }, [jadwalList, currentTime]);

  const displayName = useMemo(() => {
    const nameFromDB = userData?.nama || userData?.Nama || "";
    if (!nameFromDB) return "DOSEN";
    const firstWord = nameFromDB.trim().split(/\s+/)[0].toUpperCase();
    return userData?.Gelar ? `${firstWord}, ${userData.Gelar}` : firstWord;
  }, [userData]);

  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  }, [currentTime]);

  if (!userData) return null;

  return (
    <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-700 pb-10">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mt-4">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-[0.3em]">
            <Sparkles size={14} className="animate-pulse" />
            Executive Lecturer Portal
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter uppercase leading-none">
            {greeting}, <span className="text-rose-500">{displayName}</span>
          </h1>
        </div>

        <div className="bg-white px-8 py-5 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Waktu Sistem</p>
            <p className="text-xl font-black text-slate-700">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} 
              <span className="text-xs text-rose-500 font-bold ml-1">WIB</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Clock size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        
        <div className="bg-rose-600 p-10 min-h-55 rounded-[2.5rem] text-white shadow-xl shadow-rose-100 relative overflow-hidden group flex flex-col justify-between">
          <div className="relative z-10">
            <BookOpen size={36} className="text-rose-300 mb-6" />
            <p className="text-[10px] font-black uppercase opacity-70 tracking-widest mb-1">Total Mengajar</p>
            <p className="text-4xl font-black tracking-tighter">{loadingDashboard ? '-' : `${stats.totalSKS} SKS`}</p>
          </div>
          <h4 className="relative z-10 text-xl font-black italic uppercase tracking-tight">Semester Ganjil</h4>
          <ShieldCheck className="absolute -right-4 -bottom-4 w-36 h-36 text-white/10 rotate-12" />
        </div>

        <div className="bg-white p-10 min-h-55 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-rose-200 transition-all">
          <div className="flex justify-between items-start">
             <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                <Users size={28} />
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mahasiswa</p>
                <p className="text-4xl font-black text-slate-800 tracking-tighter">{loadingDashboard ? '-' : stats.totalMahasiswa}</p>
             </div>
          </div>
          <div>
            <p className="text-sm text-slate-400 font-bold uppercase mb-1 tracking-tighter">Anak Wali</p>
            <h4 className="text-xl font-black text-slate-800 uppercase italic leading-none">Bimbingan</h4>
          </div>
        </div>

        <div 
          onClick={() => navigate('/input-nilai')}
          className="bg-white p-10 min-h-55 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-rose-500 transition-all group cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-slate-50 group-hover:bg-rose-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-rose-500 transition-colors">
              <ClipboardCheck size={28} />
            </div>
            <ArrowUpRight className="text-slate-200 group-hover:text-rose-500 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <h4 className="text-2xl font-black text-slate-800 uppercase italic leading-tight">Input<br/>Nilai Akhir</h4>
        </div>

        <div className="bg-slate-900 p-10 min-h-55 rounded-[2.5rem] text-white shadow-xl shadow-slate-200 relative overflow-hidden flex flex-col justify-between">
          <Calendar className="text-slate-600" size={32} />
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Jadwal Terdekat</p>
            <h4 className="text-2xl font-black uppercase italic text-rose-400 leading-none">
              {nextSchedule ? `${nextSchedule.Hari}, ${nextSchedule._startLabel || '--:--'}` : '-'}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">
              {nextSchedule ? `Kelas ${nextSchedule.Kelas}` : 'Tidak ada jadwal'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shadow-sm">
                <LayoutGrid size={24} />
              </div>
              <h5 className="font-black text-slate-800 uppercase text-sm tracking-widest">Jadwal Mengajar</h5>
            </div>
            <span className="text-[11px] font-black bg-rose-100 text-rose-600 px-5 py-2 rounded-full uppercase italic">
              {loadingDashboard ? '-' : `${jadwalList.length} Mata Kuliah`}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jadwalList.length > 0 ? (
                jadwalList.map((item, i) => {
                  const jamStart = parseStartTime(item.Jam).label;
                  return (
                    <div key={item.id_jadwal || i} className="p-5 bg-slate-50 rounded-[1.8rem] flex items-center gap-5 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all border border-transparent hover:border-rose-100">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center font-black text-rose-500">
                    <span className="text-[8px] uppercase opacity-50">Jam</span>
                    <span className="text-sm">{jamStart || '--:--'}</span>
                  </div>
                  <div className="truncate">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Kelas {item.Kelas} • {item.total_mhs || 0} Mhs</p>
                    <p className="text-md font-black text-slate-700 truncate leading-tight uppercase tracking-tight">{item.NamaMatkul}</p>
                  </div>
                </div>
                  );
                })
              ) : (
                <div className="p-8 bg-slate-50 rounded-[1.8rem] border border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest text-center">
                  Tidak ada jadwal
                </div>
              )}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group text-left flex flex-col">
          <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest mb-10">Data Kepegawaian</h3>
          <div className="space-y-7 relative z-10">
            <InfoRow icon={<FileText size={18}/>} label="NIDN Identitas" value={userData?.nidn || "1234567890"} />
            <InfoRow icon={<User size={18}/>} label="Jabatan Fungsional" value="Lektor Kepala" />
            <InfoRow icon={<Award size={18}/>} label="Hak Akses" value={userData?.role?.toUpperCase()} />
          </div>
          <GraduationCap className="absolute -bottom-8 -right-8 w-40 h-40 text-slate-50 group-hover:text-rose-50 transition-all duration-700 pointer-events-none" />
        </div>
      </div>

    </div>
  );
};

export default DashboardDosen;
