import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, Calendar, Clock, LayoutGrid, Sparkles, 
  Zap, GraduationCap, BookMarked, ShieldCheck, User, Award 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InfoRow = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-4 group/row text-left">
    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover/row:bg-emerald-600 group-hover/row:text-white transition-all duration-300">{icon}</div>
    <div>
      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5 group-hover/row:text-emerald-500">{label}</p>
      <p className="text-slate-700 font-bold text-sm tracking-tight">{value}</p>
    </div>
  </div>
);

export const DashboardHome = ({ userData, krsData, loadingKrs, jatahSKS, chartData }: any) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const firstWordName = useMemo(() => {
    const nameFromDB = userData?.nama || "";
    if (!nameFromDB) return "MAHASISWA";
    return nameFromDB.trim().split(/\s+/)[0].toUpperCase();
  }, [userData]);

  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  }, [currentTime]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. GREETINGS SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">
            <Sparkles size={14} className="animate-pulse" />
            Sistem Informasi Akademik
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter uppercase leading-none">
            {greeting}, <span className="text-emerald-500">{firstWordName}</span>
          </h1>
        </div>

        <div className="bg-white px-8 py-4 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Waktu Sistem</p>
            <p className="text-xl font-black text-slate-700">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} <span className="text-xs text-slate-300 ml-1">WIB</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white"><Clock size={20} /></div>
        </div>
      </div>

      {/* 2. TOP 4 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <ShieldCheck size={32} className="text-emerald-300" />
              <div className="text-right">
                <p className="text-[10px] font-black uppercase opacity-60">Kuota SKS</p>
                <p className="text-2xl font-black">{jatahSKS}</p>
              </div>
            </div>
            <h4 className="text-xl font-black italic">KRS TERVERIFIKASI</h4>
          </div>
          <Zap className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 rotate-12" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group">
          <div className="flex justify-between items-start">
             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all"><Sparkles size={24} /></div>
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase">IP Terakhir</p>
                <p className="text-3xl font-black text-slate-800 tracking-tighter">{userData?.ipk || "0.00"}</p>
             </div>
          </div>
          <h4 className="text-lg font-black text-slate-800 uppercase italic mt-4">Prestasi</h4>
        </div>

        <Link to="/isi-krs" className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-emerald-500 transition-all group">
          <div className="flex flex-col h-full justify-between min-h-27.5">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-slate-50 group-hover:bg-emerald-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors"><LayoutGrid size={24} /></div>
              <ArrowUpRight className="text-slate-200 group-hover:text-emerald-500 transition-all" />
            </div>
            <h4 className="text-xl font-black text-slate-800 uppercase italic mt-4">Input KRS</h4>
          </div>
        </Link>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200 relative overflow-hidden">
          <Calendar className="text-slate-600 mb-4" size={28} />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Periode</p>
          <h4 className="text-xl font-black uppercase italic">Ganjil 2025/2026</h4>
        </div>
      </div>

      {/* 3. KRS SUMMARY & PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><GraduationCap size={20} /></div>
            <h5 className="font-black text-slate-800 uppercase text-xs tracking-widest">Progress</h5>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <p className="text-4xl font-black text-slate-800 tracking-tighter">84 <span className="text-sm text-slate-300">SKS</span></p>
               <p className="text-[10px] font-black text-emerald-500 uppercase">60%</p>
            </div>
            <div className="w-full h-3 bg-slate-50 rounded-full border border-slate-100 p-0.5"><div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }}></div></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4"><div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><BookMarked size={20} /></div><h5 className="font-black text-slate-800 uppercase text-xs tracking-widest">KRS Terambil</h5></div>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full uppercase italic">{loadingKrs ? '...' : `${krsData.length} MK`}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             {!loadingKrs && krsData.map((mk: any, i: number) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">{mk.SKS}</div>
                  <div className="truncate text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase truncate">{mk.NamaDosen}</p>
                    <p className="text-sm font-black text-slate-700 truncate leading-tight uppercase">{mk.NamaMatkul}</p>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* 4. CHART & PROFILE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-8 uppercase text-xs tracking-widest text-left">Grafik Indeks Prestasi</h3>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)'}} />
                <Bar dataKey="ipk" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest mb-8 text-left">Detail Profil</h3>
          <div className="space-y-5">
            <InfoRow icon={<User size={16}/>} label="NPM Identitas" value={userData?.id} />
            <InfoRow icon={<GraduationCap size={16}/>} label="Program Studi" value="Teknik Informatika" />
            <InfoRow icon={<Award size={16}/>} label="Peran" value={userData?.role?.toUpperCase()} />
          </div>
          <GraduationCap className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-50 group-hover:text-emerald-50 transition-all pointer-events-none" />
        </div>
      </div>

    </div>
  );
};