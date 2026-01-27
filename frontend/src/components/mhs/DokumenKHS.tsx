import React from 'react';
import UnikaLogo from '../../assets/unika.png';

interface Props {
  userData: any;
  khsData: any[];
  semesterAkademik: string;
  tahunAjaran: string;
}

export const DokumenKHS = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const totalSKS = props.khsData.reduce((sum, item) => sum + (Number(item.SKS) || 0), 0);
  const totalBobot = props.khsData.reduce((sum, item) => sum + (Number(item.Bobot) * Number(item.SKS)), 0);
  const ips = totalSKS > 0 ? (totalBobot / totalSKS).toFixed(2) : "0.00";

  return (
    <div ref={ref} className="bg-white p-[15mm] text-black w-full max-w-[210mm] mx-auto" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div className="flex items-center gap-6 border-b-[4px] border-double border-black pb-5 mb-8">
        <img src={UnikaLogo} alt="Logo" className="h-24 w-auto" />
        <div className="text-left flex-1">
          <h1 className="text-[20px] font-bold uppercase">Universitas Katolik Santo Thomas</h1>
          <h2 className="text-[16px] font-bold uppercase">Fakultas Ilmu Komputer</h2>
          <p className="text-[11px]">Jl. Setia Budi No.479, Medan, Sumatera Utara.</p>
        </div>
      </div>

      <h3 className="text-center text-[18px] font-bold uppercase underline mb-6">Kartu Hasil Studi (KHS)</h3>

      <div className="grid grid-cols-2 text-[12px] mb-6 leading-relaxed">
        <div>
          <p>Nama : <strong>{props.userData.Nama}</strong></p>
          <p>NPM : {props.userData.NPM}</p>
        </div>
        <div className="text-right">
          <p>Semester : {props.semesterAkademik}</p>
          <p>Tahun Ajaran : {props.tahunAjaran}</p>
        </div>
      </div>

      <table className="w-full border-collapse border border-black">
        <thead>
          <tr className="bg-gray-100 italic">
            <th className="border border-black p-2 text-[11px]">Mata Kuliah</th>
            <th className="border border-black p-2 text-[11px]">SKS</th>
            <th className="border border-black p-2 text-[11px]">Nilai</th>
            <th className="border border-black p-2 text-[11px]">Huruf</th>
            <th className="border border-black p-2 text-[11px]">Bobot</th>
          </tr>
        </thead>
        <tbody>
          {props.khsData.map((item, i) => (
            <tr key={i} className="text-center">
              <td className="border border-black p-2 text-[11px] text-left uppercase">{item.NamaMatkul}</td>
              <td className="border border-black p-2 text-[11px]">{item.SKS}</td>
              <td className="border border-black p-2 text-[11px]">{item.NA}</td>
              <td className="border border-black p-2 text-[11px] font-bold">{item.Huruf}</td>
              <td className="border border-black p-2 text-[11px] font-mono">{Number(item.Bobot).toFixed(1)}</td>
            </tr>
          ))}
          <tr className="font-bold bg-gray-50">
            <td colSpan={4} className="border border-black p-2 text-right text-[11px] uppercase">Indeks Prestasi Semester (IPS)</td>
            <td className="border border-black p-2 text-[14px]">{ips}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-20 flex justify-end px-10">
        <div className="text-center">
          <p className="text-[13px] mb-20 font-bold uppercase">Kepala Biro Akademik,</p>
          <div className="w-48 border-b border-black mx-auto"></div>
          <p className="text-[11px] mt-1">NIDN. ............................</p>
        </div>
      </div>
    </div>
  );
});