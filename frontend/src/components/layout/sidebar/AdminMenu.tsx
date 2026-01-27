import { useState } from 'react';
import { ShieldCheck, Printer, FileText, Database, Users, GraduationCap, BookOpen, ChevronDown, User } from 'lucide-react';

interface AdminMenuProps {
  isSidebarOpen: boolean;
  activePage: string;
  activeLightBg: string;
  activeIconColor: string;
  onNavigate: (page: string, path: string) => void;
}

const AdminMenu = ({ isSidebarOpen, activePage, activeLightBg, activeIconColor, onNavigate }: AdminMenuProps) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMasterOpen, setIsMasterOpen] = useState(false);

  return (
    <div className="space-y-2">
      <button 
        onClick={() => onNavigate('admin/console', '/admin/console')}
        className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
          activePage === 'admin/console' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
        }`}
      >
        <div className="w-12 flex justify-center shrink-0">
          <ShieldCheck size={22} className={activePage === 'admin/console' ? activeIconColor : 'text-slate-400'} />
        </div>
        {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Admin Console</span>}
      </button>
      <button 
        onClick={() => onNavigate('admin/profile', '/admin/profile')}
        className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
          activePage === 'admin/profile' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
        }`}
      >
        <div className="w-12 flex justify-center shrink-0">
          <User size={22} className={activePage === 'admin/profile' ? activeIconColor : 'text-slate-400'} />
        </div>
        {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Profil Admin</span>}
      </button>

      <button 
        onClick={() => isSidebarOpen && setIsReportOpen(!isReportOpen)}
        className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
          isReportOpen ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
        }`}
      >
        <div className="w-12 flex justify-center shrink-0">
          <Printer size={22} className={isReportOpen ? activeIconColor : 'text-slate-400'} />
        </div>
        {isSidebarOpen && (
          <div className="flex flex-1 items-center justify-between pr-4 overflow-hidden">
            <span className="font-bold text-[11px] uppercase tracking-widest truncate">Laporan Akademik</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isReportOpen ? 'rotate-180' : ''}`} />
          </div>
        )}
      </button>
      {isSidebarOpen && (
        <div className={`overflow-hidden transition-all duration-300 ${isReportOpen ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          <button onClick={() => onNavigate('admin/reports/krs', '/admin/reports/krs')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
            <FileText size={14} className="mr-3" /> Cetak KRS
          </button>
          <button onClick={() => onNavigate('admin/reports/khs', '/admin/reports/khs')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
            <FileText size={14} className="mr-3" /> Cetak KHS
          </button>
          <button onClick={() => onNavigate('admin/reports/absensi', '/admin/reports/absensi')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
            <FileText size={14} className="mr-3" /> Rekap Absensi
          </button>
        </div>
      )}

      <button 
        onClick={() => isSidebarOpen && setIsMasterOpen(!isMasterOpen)}
        className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
          isMasterOpen ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
        }`}
      >
        <div className="w-12 flex justify-center shrink-0">
          <Database size={22} className={isMasterOpen ? activeIconColor : 'text-slate-400'} />
        </div>
        {isSidebarOpen && (
          <div className="flex flex-1 items-center justify-between pr-4 overflow-hidden">
            <span className="font-bold text-[11px] uppercase tracking-widest truncate">Input Data Master</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isMasterOpen ? 'rotate-180' : ''}`} />
          </div>
        )}
      </button>
      {isSidebarOpen && (
        <div className={`overflow-hidden transition-all duration-300 ${isMasterOpen ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          <button onClick={() => onNavigate('admin/master/mahasiswa', '/admin/master/mahasiswa')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
            <Users size={14} className="mr-3" /> Mahasiswa
          </button>
          <button onClick={() => onNavigate('admin/master/dosen', '/admin/master/dosen')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
            <GraduationCap size={14} className="mr-3" /> Dosen
          </button>
          <button onClick={() => onNavigate('admin/master/matakuliah', '/admin/master/matakuliah')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
            <BookOpen size={14} className="mr-3" /> Mata Kuliah
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
