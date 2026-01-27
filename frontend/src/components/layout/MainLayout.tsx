import { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isKRSMenuOpen, setIsKRSMenuOpen] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  
  const currentPath = location.pathname.replace('/', '') || 'dashboard';
  const [activePage, setActivePage] = useState(currentPath);

  const userData = useMemo(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { nama: 'User', id: '0', role: 'mahasiswa' };
  }, []);

  const isDosen = userData.role === 'dosen';
  const accentColorClass = isDosen ? 'text-blue-600' : 'text-emerald-600';
  const avatarBgClass = isDosen ? 'bg-blue-600 shadow-blue-200' : 'bg-emerald-600 shadow-emerald-200';
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'dashboard';
    setActivePage(path);
  }, [location.pathname]);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        if (userData.role === 'mahasiswa') {
          const res = await fetch(`${apiBase}/api/mahasiswa/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await res.json();
          const foto = result?.data?.Foto;
          setProfilePhotoUrl(foto ? `${apiBase}/uploads/${foto}` : null);
        } else if (userData.role === 'dosen') {
          const res = await fetch(`${apiBase}/api/dosen/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await res.json();
          const foto = result?.data?.Foto;
          setProfilePhotoUrl(foto ? `${apiBase}/uploads/${foto}` : null);
        } else {
          setProfilePhotoUrl(null);
        }
      } catch (err) {
        setProfilePhotoUrl(null);
      }
    };
    fetchProfilePhoto();
  }, [userData, apiBase]);

  const handleSetActivePage = (page: string) => {
    setActivePage(page);
    if (page === 'dashboard') {
      navigate('/dashboard');
    } else {
      navigate(`/${page}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        isMobile={isMobile}
        activePage={activePage}
        setActivePage={handleSetActivePage}
        userData={userData}
        isKRSMenuOpen={isKRSMenuOpen}
        setIsKRSMenuOpen={setIsKRSMenuOpen}
        handleLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 h-screen">
        
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Menu size={24} />
              </button>
            )}
            <h2 className="font-black text-slate-700 uppercase text-[10px] md:text-xs tracking-[0.2em]">
              SIAK - Universitas Katolik Santo Thomas Medan
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800 uppercase leading-none">
                {userData.nama}
              </p>
              <p className={`text-[10px] ${accentColorClass} font-black uppercase tracking-widest mt-1`}>
                {userData.id || userData.nidn}
              </p>
            </div>
            
            <div className={`h-10 w-10 ${avatarBgClass} text-white rounded-2xl flex items-center justify-center font-bold border-2 border-white shadow-sm uppercase overflow-hidden`}>
              {profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt="Profil" className="h-full w-full object-cover" />
              ) : (
                userData.nama?.charAt(0)
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-360 mx-auto p-6 md:p-10 lg:p-12">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
