import { useEffect, useState } from 'react';
import { CalendarDays, Save, Trash2, Edit3, Sparkles } from 'lucide-react';

const InputJadwal = () => {
  const [list, setList] = useState<any[]>([]);
  const [matkulList, setMatkulList] = useState<any[]>([]);
  const [dosenList, setDosenList] = useState<any[]>([]);
  const [form, setForm] = useState({ KodeMK: '', NIDN: '', Kelas: 'A' });
  const [editing, setEditing] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  const fetchList = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/staff/jadwal`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setList(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setList([]);
    }
  };

  const fetchRefs = async () => {
    try {
      const resMatkul = await fetch(`http://localhost:5000/api/staff/matakuliah`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataMatkul = await resMatkul.json();
      setMatkulList(Array.isArray(dataMatkul.data) ? dataMatkul.data : []);

      const resDsn = await fetch(`http://localhost:5000/api/staff/dosen-list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataDsn = await resDsn.json();
      setDosenList(Array.isArray(dataDsn.data) ? dataDsn.data : []);
    } catch (err) {
      setMatkulList([]);
      setDosenList([]);
    }
  };

  useEffect(() => { fetchList(); fetchRefs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { KodeMK: form.KodeMK, NIDN: form.NIDN, Kelas: form.Kelas };
    const url = editing
      ? `http://localhost:5000/api/staff/jadwal/${editing}`
      : `http://localhost:5000/api/staff/jadwal`;
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    setForm({ KodeMK: '', NIDN: '', Kelas: 'A' });
    setEditing(null);
    fetchList();
  };

  const handleEdit = (item: any) => {
    setEditing(item.id_jadwal);
    setForm({ KodeMK: item.KodeMK, NIDN: item.NIDN, Kelas: item.Kelas });
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/api/staff/jadwal/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchList();
  };

  return (
    <div className="w-full space-y-8 pb-20">
      <div className="bg-slate-950 p-8 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> PEGAWAI
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Input <span className="text-emerald-500 italic">Jadwal</span>
            </h1>
          </div>
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <CalendarDays size={22} className="text-white" />
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="h-12 px-4 rounded-xl bg-slate-50" value={form.KodeMK} onChange={(e) => setForm({ ...form, KodeMK: e.target.value })}>
            <option value="">Pilih Mata Kuliah</option>
            {matkulList.map((m) => (
              <option key={m.KodeMK} value={m.KodeMK}>{m.KodeMK} - {m.NamaMatkul}</option>
            ))}
          </select>
          <select className="h-12 px-4 rounded-xl bg-slate-50" value={form.NIDN} onChange={(e) => setForm({ ...form, NIDN: e.target.value })}>
            <option value="">Pilih Dosen</option>
            {dosenList.map((d) => (
              <option key={d.NIDN} value={d.NIDN}>{d.NIDN} - {d.Nama}</option>
            ))}
          </select>
          <select className="h-12 px-4 rounded-xl bg-slate-50" value={form.Kelas} onChange={(e) => setForm({ ...form, Kelas: e.target.value })}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="P">P</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Save size={14} /> {editing ? 'Update' : 'Simpan'}
        </button>
      </form>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-slate-400">
              <th className="py-2">ID</th>
              <th>Matkul</th>
              <th>Dosen</th>
              <th>Kelas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((j) => (
              <tr key={j.id_jadwal} className="border-t border-slate-100">
                <td className="py-2">{j.id_jadwal}</td>
                <td>{j.NamaMatkul}</td>
                <td>{j.NamaDosen}</td>
                <td>{j.Kelas}</td>
                <td className="flex gap-3 py-2">
                  <button type="button" onClick={() => handleEdit(j)} className="text-emerald-600 text-[10px] font-black uppercase flex items-center gap-1">
                    <Edit3 size={12} /> edit
                  </button>
                  <button type="button" onClick={() => handleDelete(j.id_jadwal)} className="text-red-600 text-[10px] font-black uppercase flex items-center gap-1">
                    <Trash2 size={12} /> hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InputJadwal;
