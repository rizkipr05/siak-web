import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  variant?: 'danger' | 'success' | 'warning';
}

export const ModalCustom = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Konfirmasi',
  variant = 'success'
}: ModalProps) => {
  if (!isOpen) return null;

  const config = {
    danger: {
      accent: 'bg-red-50 text-red-500',
      button: 'bg-red-500 shadow-red-500/30',
      icon: <AlertCircle className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
    },
    success: {
      accent: 'bg-emerald-50 text-emerald-500',
      button: 'bg-emerald-600 shadow-emerald-600/30',
      icon: <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
    },
    warning: {
      accent: 'bg-orange-50 text-orange-500',
      button: 'bg-slate-900 shadow-slate-900/20',
      icon: <ShieldAlert className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
    }
  }[variant];

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999999 }}>
      <style>{`
        @keyframes modalBounceCustom {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: modalBounceCustom 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
      
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 w-[92%] max-w-105 relative z-10000000 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] animate-bounce-in text-center border border-slate-100">
        
        <div className={`w-16 h-16 md:w-20 md:h-20 ${config.accent} rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8`}>
          {config.icon}
        </div>

        <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase mb-2 md:mb-3 tracking-tighter leading-tight">
          {title}
        </h3>

        <div className="text-slate-600 text-[13px] md:text-sm mb-8 md:mb-10 font-bold leading-relaxed px-2 md:px-4">
          {message}
        </div>

        <div className={`${!onClose ? 'flex justify-center' : 'grid grid-cols-2'} gap-3 md:gap-4`}>
          {onClose && (
            <button 
              onClick={onClose} 
              className="py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-100 text-slate-500 font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              Batal
            </button>
          )}

          <button 
            onClick={onConfirm || onClose} 
            className={`py-4 md:py-5 ${!onClose ? 'w-full' : ''} rounded-xl md:rounded-2xl ${config.button} text-white font-black text-[10px] md:text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:brightness-110`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
