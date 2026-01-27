import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface LoadAnimateProps {
  duration?: number;
  onComplete?: () => void;
  userType?: 'mahasiswa' | 'dosen' | 'staff'; // Menambahkan tipe staff
}

const LoadAnimate = ({ duration = 1500, onComplete, userType = 'staff' }: LoadAnimateProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const isMahasiswa = userType === 'mahasiswa';
  const isStaff = userType === 'staff';

  const theme = {
    ringOuter: isStaff 
      ? 'border-t-indigo-600' 
      : isMahasiswa ? 'border-t-emerald-500' : 'border-t-rose-600',
    ringInner: isStaff 
      ? 'border-b-indigo-400' 
      : isMahasiswa ? 'border-b-teal-400' : 'border-b-rose-400',
    core: isStaff
      ? 'from-indigo-600 to-indigo-400 shadow-indigo-500/50'
      : isMahasiswa 
      ? 'from-emerald-500 to-teal-400 shadow-emerald-500/50' 
      : 'from-rose-600 to-rose-400 shadow-rose-600/50',
    particle: isStaff
      ? 'bg-indigo-400 shadow-indigo-400'
      : isMahasiswa 
      ? 'bg-emerald-400 shadow-emerald-400' 
      : 'bg-rose-500 shadow-rose-500/80',
    dots: isStaff ? 'bg-indigo-600' : isMahasiswa ? 'bg-emerald-500' : 'bg-rose-600',
    text: isStaff ? 'text-indigo-500' : isMahasiswa ? 'text-emerald-500' : 'text-rose-500'
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-20 animate-in fade-in duration-500">
      <div className="relative w-24 h-24 flex items-center justify-center">
        
        <div className={`absolute inset-0 border-[3px] border-slate-100 rounded-full ${theme.ringOuter} animate-[spin_3s_linear_infinite]`}></div>
        
        <div className={`absolute inset-3 border-[3px] border-slate-100 rounded-full ${theme.ringInner} animate-[spin_2s_linear_infinite_reverse]`}></div>
        
        <div className={`w-6 h-6 bg-linear-to-tr ${theme.core} rounded-full shadow-lg animate-pulse`}></div>

        <div className="absolute inset-0 animate-[spin_1.5s_linear_infinite]">
          <div className={`w-2 h-2 ${theme.particle} rounded-full absolute -top-1 left-1/2 -translate-x-1/2 shadow-lg`}></div>
        </div>
      </div>

      <div className="mt-10 text-center space-y-3">
        <div className="flex items-center justify-center gap-1.5">
          <span className={`w-1.5 h-1.5 ${theme.dots} rounded-full animate-bounce [animation-delay:-0.3s]`}></span>
          <span className={`w-1.5 h-1.5 ${theme.dots} rounded-full animate-bounce [animation-delay:-0.15s]`}></span>
          <span className={`w-1.5 h-1.5 ${theme.dots} rounded-full animate-bounce`}></span>
        </div>
        
        <div className="flex flex-col items-center gap-1.5">
          <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.5em] flex items-center gap-2">
            <Sparkles size={10} className={theme.text}/> Synchronizing
          </h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase italic tracking-widest">
            Menyiapkan Halaman {userType}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadAnimate;