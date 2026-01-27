import { useEffect, useState } from 'react';
import { BookOpen, Save, Trash2, Edit3, Sparkles } from 'lucide-react';

const InputMatkul = () => {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ KodeMK: '', NamaMatkul: '', SKS: '', Semester: '' });
  const [editing, setEditing] = useState<string | null>(null);

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  const fetchList = async () => {
    try {
      const res = await fetch(`${apiBase}/api/admin/master/matakuliah`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setList(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setList([]);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      KodeMK: form.KodeMK,
      NamaMatkul: form.NamaMatkul,
      SKS: Number(form.SKS),
      Semester: Number(form.Semester)
    };
    const url = editing
      ? `${apiBase}/api/admin/master/matakuliah/${editing}`
      : `${apiBase}/api/admin/master/matakuliah`;
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    setForm({ KodeMK: '', NamaMatkul: '', SKS: '', Semester: '' });
    setEditing(null);
    fetchList();
  };

  const handleEdit = (item: any) => {
    setEditing(item.KodeMK);
    setForm({
      KodeMK: item.KodeMK,
      NamaMatkul: item.NamaMatkul,
      SKS: String(item.SKS),
      Semester: String(item.Semester)
    });
  };

  const handleDelete = async (kode: string) => {
    await fetch(`${apiBase}/api/admin/master/matakuliah/${kode}`, {
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" /> ADMIN
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Master <span className="text-indigo-500 italic">Mata Kuliah</span>
            </h1>
          </div>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <BookOpen size={22} className="text-white" />
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="Kode MK" value={form.KodeMK} onChange={(e) => setForm({ ...form, KodeMK: e.target.value })} disabled={!!editing} />
          <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="Nama Matkul" value={form.NamaMatkul} onChange={(e) => setForm({ ...form, NamaMatkul: e.target.value })} />
          <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="SKS" type="number" value={form.SKS} onChange={(e) => setForm({ ...form, SKS: e.target.value })} />
          <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="Semester" type="number" value={form.Semester} onChange={(e) => setForm({ ...form, Semester: e.target.value })} />
        </div>
        <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Save size={14} /> {editing ? 'Update' : 'Simpan'}
        </button>
      </form>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-slate-400">
              <th className="py-2">Kode</th>
              <th>Nama</th>
              <th>SKS</th>
              <th>Semester</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.KodeMK} className="border-t border-slate-100">
                <td className="py-2">{m.KodeMK}</td>
                <td>{m.NamaMatkul}</td>
                <td>{m.SKS}</td>
                <td>{m.Semester}</td>
                <td className="flex gap-3 py-2">
                  <button type="button" onClick={() => handleEdit(m)} className="text-indigo-600 text-[10px] font-black uppercase flex items-center gap-1">
                    <Edit3 size={12} /> edit
                  </button>
                  <button type="button" onClick={() => handleDelete(m.KodeMK)} className="text-red-600 text-[10px] font-black uppercase flex items-center gap-1">
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

export default InputMatkul;
