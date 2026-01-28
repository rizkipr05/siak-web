import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen,  
  LogOut, 
  X, 
  Menu, 
  ChevronDown, 
  Edit3, 
  Eye, 
  CalendarCheck,
  UserCheck,
  ClipboardCheck,
  FileText,
  Printer,
  Database,
  Users,
  GraduationCap,
  User,
  Calendar
} from 'lucide-react';
import UnikaLogo from '../../assets/unika.png';
import AdminMenu from './sidebar/AdminMenu';
import { ModalCustom } from './ModalCustom';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  isMobile: boolean;
  activePage: string;
  setActivePage: (val: any) => void;
  userData: any;
  isKRSMenuOpen: boolean;
  setIsKRSMenuOpen: (val: boolean) => void;
  handleLogout: () => void;
}

const Sidebar = ({ 
  isSidebarOpen, setIsSidebarOpen, isMobile, activePage, 
  setActivePage, userData, isKRSMenuOpen, setIsKRSMenuOpen, handleLogout 
}: SidebarProps) => {
  const navigate = useNavigate();

  const [isLaporanOpen, setIsLaporanOpen] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isDosen = userData?.role === 'dosen';
  const isAdmin = userData?.role === 'admin';
  const isPegawai = userData?.role === 'pegawai';
  const isMahasiswa = userData?.role === 'mahasiswa';
  const isStaff = isPegawai;

  const activeBg = isDosen ? 'bg-rose-500' : (isAdmin ? 'bg-blue-600' : 'bg-emerald-600');
  
  const activeLightBg = isDosen 
    ? 'bg-rose-50 text-rose-700' 
    : (isAdmin ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700');
    
  const activeIconColor = isDosen 
    ? 'text-rose-600' 
    : (isAdmin ? 'text-blue-600' : 'text-emerald-600');

  const handleNavClick = (page: string, path: string) => {
    setActivePage(page);
    navigate(path);
    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-55 transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`bg-white border-r border-slate-200 fixed lg:sticky top-0 h-screen z-60 transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-20'} ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}>
        
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50">
          <img src={UnikaLogo} alt="Logo" className={`h-10 transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`} />
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar">
          
          <button 
            onClick={() => handleNavClick('dashboard', '/dashboard')}
            className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
              activePage === 'dashboard' 
                ? `${activeBg} text-white shadow-lg shadow-rose-100` 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <div className="w-12 flex justify-center shrink-0"><LayoutDashboard size={22} /></div>
            {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Dashboard</span>}
          </button>

          {isDosen && (
            <>
              <button 
                onClick={() => handleNavClick('pertemuan', '/pertemuan')}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  activePage === 'pertemuan' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <CalendarCheck size={22} className={activePage === 'pertemuan' ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Pertemuan</span>}
              </button>

              <button 
                onClick={() => handleNavClick('absensi', '/absensi')}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  activePage === 'absensi' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <UserCheck size={22} className={activePage === 'absensi' ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Absensi</span>}
              </button>

              <button 
                onClick={() => handleNavClick('input-nilai', '/input-nilai')}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  activePage === 'input-nilai' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <Edit3 size={22} className={activePage === 'input-nilai' ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Input Nilai</span>}
              </button>

              <button 
                onClick={() => handleNavClick('bimbingan', '/bimbingan')}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  activePage === 'bimbingan' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <Users size={22} className={activePage === 'bimbingan' ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Bimbingan</span>}
              </button>

              <button 
                onClick={() => handleNavClick('approval-krs', '/approval-krs')}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  activePage === 'approval-krs' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <ClipboardCheck size={22} className={activePage === 'approval-krs' ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Approval KRS</span>}
              </button>

              <button 
                onClick={() => handleNavClick('dosen/profile', '/dosen/profile')}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  activePage === 'dosen/profile' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <User size={22} className={activePage === 'dosen/profile' ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Profil Dosen</span>}
              </button>
            </>
          )}

          {isMahasiswa && (
            <div className="relative group/krs">
              <button 
                onClick={() => isSidebarOpen && setIsKRSMenuOpen(!isKRSMenuOpen)}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  ['isi-krs', 'hasil-krs'].includes(activePage) ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <BookOpen size={22} className={['isi-krs', 'hasil-krs'].includes(activePage) ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && (
                  <div className="flex flex-1 items-center justify-between pr-4 overflow-hidden">
                    <span className="font-bold text-[11px] uppercase tracking-widest truncate">Akademik</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isKRSMenuOpen ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </button>
              
              {isSidebarOpen && (
                <div className={`overflow-hidden transition-all duration-300 ${isKRSMenuOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <button onClick={() => handleNavClick('isi-krs', '/isi-krs')} className={`flex items-center w-full py-3 pl-12 text-[11px] font-bold uppercase tracking-widest transition-colors ${activePage === 'isi-krs' ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}>
                    <Edit3 size={16} className="mr-3" /> Isi KRS Online
                  </button>
                  <button onClick={() => handleNavClick('hasil-krs', '/hasil-krs')} className={`flex items-center w-full py-3 pl-12 text-[11px] font-bold uppercase tracking-widest transition-colors ${activePage === 'hasil-krs' ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}>
                    <Eye size={16} className="mr-3" /> Lihat Hasil KRS
                  </button>
                </div>
              )}
            </div>
          )}

          {isMahasiswa && (
            <>
              <button 
                onClick={() => handleNavClick('transkrip-sementara', '/transkrip-sementara')}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  activePage === 'transkrip-sementara' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <FileText size={22} className={activePage === 'transkrip-sementara' ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Transkrip Sementara</span>}
              </button>

              <button 
                onClick={() => handleNavClick('absensi-saya', '/absensi-saya')}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  activePage === 'absensi-saya' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <UserCheck size={22} className={activePage === 'absensi-saya' ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Absensi Saya</span>}
              </button>

              <button 
                onClick={() => handleNavClick('nilai-saya', '/nilai-saya')}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  activePage === 'nilai-saya' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <ClipboardCheck size={22} className={activePage === 'nilai-saya' ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Nilai Saya</span>}
              </button>

              <button 
                onClick={() => handleNavClick('khs', '/khs')}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  activePage === 'khs' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <FileText size={22} className={activePage === 'khs' ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Cetak KHS</span>}
              </button>

              <button 
                onClick={() => handleNavClick('profil', '/profil')}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  activePage === 'profil' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <User size={22} className={activePage === 'profil' ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Profil</span>}
              </button>
            </>
          )}

          {isStaff && (
            <div className="relative">
              <button 
                onClick={() => isSidebarOpen && setIsLaporanOpen(!isLaporanOpen)}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  isLaporanOpen ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <Printer size={22} className={isLaporanOpen ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && (
                  <div className="flex flex-1 items-center justify-between pr-4 overflow-hidden">
                    <span className="font-bold text-[11px] uppercase tracking-widest truncate">Laporan Akademik</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isLaporanOpen ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </button>
              
              {isSidebarOpen && (
                <div className={`overflow-hidden transition-all duration-300 ${isLaporanOpen ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <button onClick={() => handleNavClick('cetak-krs', '/reports/krs')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
                    <FileText size={14} className="mr-3" /> Cetak KRS
                  </button>
                  <button onClick={() => handleNavClick('cetak-khs', '/reports/khs')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
                    <FileText size={14} className="mr-3" /> Cetak KHS
                  </button>
                  <button onClick={() => handleNavClick('rekap-absensi', '/reports/absensi')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
                    <FileText size={14} className="mr-3" /> Rekap Absensi
                  </button>
                </div>
              )}
            </div>
          )}

          {isPegawai && (
            <button 
              onClick={() => handleNavClick('pegawai/profile', '/pegawai/profile')}
              className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                activePage === 'pegawai/profile' ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className="w-12 flex justify-center shrink-0">
                <User size={22} className={activePage === 'pegawai/profile' ? activeIconColor : 'text-slate-400'} />
              </div>
              {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Profil Pegawai</span>}
            </button>
          )}

          {isStaff && (
            <div className="relative">
              <button 
                onClick={() => isSidebarOpen && setIsInputOpen(!isInputOpen)}
                className={`flex items-center w-full py-3.5 rounded-2xl transition-all ${
                  isInputOpen ? activeLightBg : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">
                  <Database size={22} className={isInputOpen ? activeIconColor : 'text-slate-400'} />
                </div>
                {isSidebarOpen && (
                  <div className="flex flex-1 items-center justify-between pr-4 overflow-hidden">
                    <span className="font-bold text-[11px] uppercase tracking-widest truncate">Input Data Master</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isInputOpen ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </button>
              
              {isSidebarOpen && (
                <div className={`overflow-hidden transition-all duration-300 ${isInputOpen ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <button onClick={() => handleNavClick('input-mhs', '/master/mahasiswa')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
                    <Users size={14} className="mr-3" /> Mahasiswa
                  </button>
                  <button onClick={() => handleNavClick('input-dosen', '/master/dosen')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
                    <GraduationCap size={14} className="mr-3" /> Dosen
                  </button>
                  <button onClick={() => handleNavClick('input-matkul', '/master/matakuliah')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
                    <BookOpen size={14} className="mr-3" /> Mata Kuliah
                  </button>
                  <button onClick={() => handleNavClick('input-ruang', '/master/ruang')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
                    <Database size={14} className="mr-3" /> Ruang Kelas
                  </button>
                  <button onClick={() => handleNavClick('input-jadwal', '/master/jadwal')} className="flex items-center w-full py-3 pl-12 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
                    <Calendar size={14} className="mr-3" /> Jadwal Kuliah
                  </button>
                </div>
              )}
            </div>
          )}

          {isAdmin && (
            <AdminMenu
              isSidebarOpen={isSidebarOpen}
              activePage={activePage}
              activeLightBg={activeLightBg}
              activeIconColor={activeIconColor}
              onNavigate={handleNavClick}
            />
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-50 bg-white">
          <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center w-full py-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all group">
            <div className="w-12 flex justify-center shrink-0">
              <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-widest">Keluar</span>}
          </button>
        </div>

        <ModalCustom
          isOpen={showLogoutConfirm}
          variant="warning"
          title="Keluar dari aplikasi?"
          message="Apakah kamu yakin ingin keluar dari akun ini?"
          confirmText="Keluar"
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={() => {
            setShowLogoutConfirm(false);
            handleLogout();
          }}
        />
      </aside>
    </>
  );
};

export default Sidebar;
