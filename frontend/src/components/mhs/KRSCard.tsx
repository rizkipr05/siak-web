import { CheckCircle2, PlusCircle, Lock } from 'lucide-react';

interface KRSCardProps {
  mk: any;
  isDisabled: boolean;
  selectedForThisMK: boolean;
  handlePilihKelas: (jadwal: any, kodeMK: string) => void;
  selectedJadwal: any[];
}

const KRSCard = ({ mk, isDisabled, selectedForThisMK, handlePilihKelas, selectedJadwal }: KRSCardProps) => {
  return (
    <div className={`bg-white rounded-[2rem] md:rounded-[2.5rem] border-2 transition-all duration-500 ${
      isDisabled ? 'border-emerald-100 opacity-80 bg-slate-50/30' : 
      selectedForThisMK ? 'border-emerald-500 shadow-xl shadow-emerald-100' : 'border-slate-100 shadow-sm'
    }`}>
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        <div className="lg:col-span-5 p-6 md:p-8 flex items-center gap-4 md:gap-6 border-b lg:border-b-0 lg:border-r border-slate-50">
          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0 font-black text-lg md:text-xl shadow-inner ${
            isDisabled ? 'bg-emerald-50 text-emerald-500' :
            selectedForThisMK ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
          }`}>
            {isDisabled ? <CheckCircle2 size={24} /> : mk.Semester}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md">
                {mk.SKS} SKS
              </span>
              <span className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest">{mk.KodeMK}</span>
              {isDisabled && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter bg-emerald-100/50 px-2 rounded-full">Tersimpan</span>}
            </div>
            <h3 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-tighter leading-tight truncate">
              {mk.NamaMatkul}
            </h3>
          </div>
        </div>

        {/* Opsi Kelas - Mobile Optimized Grid */}
        <div className="lg:col-span-7 p-4 md:p-6 bg-slate-50/30">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-3">
            {mk.opsiKelas && mk.opsiKelas.map((kelas: any) => {
              const isSelectedInDraft = selectedJadwal.some(s => s.id_jadwal === kelas.id_jadwal);
              
              return (
                <button
                  key={kelas.id_jadwal}
                  disabled={isDisabled} 
                  onClick={() => handlePilihKelas(kelas, mk.KodeMK)}
                  className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl md:rounded-2xl border-2 transition-all group ${
                    isDisabled ? 'bg-white border-emerald-100 text-slate-300' : 
                    isSelectedInDraft ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 
                    'bg-white border-white text-slate-600 hover:border-emerald-200'
                  }`}
                >
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-black text-xs md:text-sm shrink-0 ${
                    isSelectedInDraft ? 'bg-white/20' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {kelas.Kelas}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-tight truncate ${
                      isSelectedInDraft ? 'text-emerald-100' : 'text-slate-500'
                    }`}>
                      {kelas.NamaDosen ? kelas.NamaDosen.split(',')[0] : 'TBA'}
                    </p>
                  </div>
                  <div className="ml-auto shrink-0">
                    {isDisabled ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 
                     isSelectedInDraft ? <CheckCircle2 className="w-4 h-4 text-white" /> : 
                     <PlusCircle className="w-4 h-4 text-slate-200 group-hover:text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KRSCard;