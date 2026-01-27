import React from 'react';
import UnikaLogo from '../../assets/unika.png';

interface Props {
  userData: any;
  krsData: any[];
  totalSKS: number;
  semesterAkademik: string;
  tahunAjaran: string;
}

export const DokumenKRS = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-white p-[15mm] text-black w-full max-w-[210mm] mx-auto"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="flex items-center gap-6 border-b-[4px] border-double border-black pb-5 mb-8">
        <img src={UnikaLogo} alt="Logo" className="h-24 w-auto object-contain" />
        <div className="text-left flex-1">
          <h1 className="text-[20px] font-bold uppercase leading-tight">Universitas Katolik Santo Thomas</h1>
          <h2 className="text-[16px] font-bold uppercase leading-tight">Fakultas Ilmu Komputer - Informatika</h2>
          <p className="text-[11px] mt-2 leading-snug">
            Jl. Setia Budi No.479, Medan, Sumatera Utara. <br />
            Laman: www.ust.ac.id | Email: info@ust.ac.id
          </p>
        </div>
      </div>

      <h3 className="text-center text-xl font-bold uppercase underline underline-offset-4 mb-10 tracking-[0.1em]">
        Kartu Rencana Studi (KRS)
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-8 text-[13px]">
        <table className="w-full">
          <tbody>
            <tr><td className="w-24 py-1">NPM</td><td>: {props.userData.id}</td></tr>
            <tr><td className="py-1">NAMA</td><td className="uppercase">: {props.userData.nama}</td></tr>
          </tbody>
        </table>
        <table className="w-full">
          <tbody>
            <tr><td className="w-24 py-1">SEMESTER</td><td>: {props.semesterAkademik}</td></tr>
            <tr><td className="py-1">T. AJARAN</td><td>: {props.tahunAjaran}</td></tr>
          </tbody>
        </table>
      </div>

      <table className="w-full border-collapse border border-black text-[12px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-2 w-10 text-center uppercase">No</th>
            <th className="border border-black p-2 w-28 text-center uppercase">Kode MK</th>
            <th className="border border-black p-2 text-left uppercase">Mata Kuliah</th>
            <th className="border border-black p-2 w-12 text-center uppercase">SKS</th>
            <th className="border border-black p-2 text-left uppercase">Dosen Pengampu</th>
          </tr>
        </thead>
        <tbody>
          {props.krsData.map((item, index) => (
            <tr key={index}>
              <td className="border border-black p-2 text-center">{index + 1}</td>
              <td className="border border-black p-2 text-center font-mono">{item.KodeMK}</td>
              <td className="border border-black p-2 uppercase font-bold text-left">{item.NamaMatkul}</td>
              <td className="border border-black p-2 text-center font-bold">{item.SKS}</td>
              <td className="border border-black p-2 text-[11px] leading-tight text-left italic">{item.NamaDosen}</td>
            </tr>
          ))}
          <tr className="font-bold">
            <td colSpan={3} className="border border-black p-3 text-right text-[11px] uppercase">Total SKS Diambil</td>
            <td className="border border-black p-3 text-center text-lg bg-gray-50">{props.totalSKS}</td>
            <td className="border border-black"></td>
          </tr>
        </tbody>
      </table>

      <div className="mt-24 flex justify-between px-10">
        <div className="text-center">
          <p className="text-[13px] mb-24 font-bold">Dosen Wali,</p>
          <div className="w-48 border-b border-black mx-auto"></div>
          <p className="text-[11px] mt-1 italic">NIDN. ............................</p>
        </div>
        <div className="text-center">
          <p className="text-[13px] mb-24 font-bold">Medan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="text-[13px] font-bold underline uppercase">{props.userData.nama}</p>
          <p className="text-[11px]">Mahasiswa</p>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-gray-100 text-[9px] text-gray-400 italic text-center print:block hidden">
        Dokumen ini dicetak melalui Sistem Informasi Akademik (SIAKAD) UNIKA Santo Thomas.
      </div>
    </div>
  );
});

DokumenKRS.displayName = "DokumenKRS";