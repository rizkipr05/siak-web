import { useEffect, useState } from 'react';
import { Building2, Save, Trash2, Edit3, Sparkles } from 'lucide-react';

const InputRuang = () => {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ kode_ruang: '', nama_ruang: '', kapasitas: '' });
  const [editing, setEditing] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  const fetchList = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/staff/ruang`, {
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
      kode_ruang: form.kode_ruang,
      nama_ruang: form.nama_ruang,
      kapasitas: Number(form.kapasitas)
    };
    const url = editing
      ? `http://localhost:5000/api/staff/ruang/${editing}`
      : `http://localhost:5000/api/staff/ruang`;
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    setForm({ kode_ruang: '', nama_ruang: '', kapasitas: '' });
    setEditing(null);
    fetchList();
  };

  const handleEdit = (item: any) => {
    setEditing(item.kode_ruang);
    setForm({
      kode_ruang: item.kode_ruang,
      nama_ruang: item.nama_ruang,
      kapasitas: String(item.kapasitas || '')
    });
  };

  const handleDelete = async (kode: string) => {
    await fetch(`http://localhost:5000/api/staff/ruang/${kode}`, {
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
              Master <span className="text-emerald-500 italic">Ruang Kelas</span>
            </h1>
          </div>
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <Building2 size={22} className="text-white" />
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="Kode Ruang" value={form.kode_ruang} onChange={(e) => setForm({ ...form, kode_ruang: e.target.value })} disabled={!!editing} />
          <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="Nama Ruang" value={form.nama_ruang} onChange={(e) => setForm({ ...form, nama_ruang: e.target.value })} />
          <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="Kapasitas" type="number" value={form.kapasitas} onChange={(e) => setForm({ ...form, kapasitas: e.target.value })} />
        </div>
        <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Save size={14} /> {editing ? 'Update' : 'Simpan'}
        </button>
      </form>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-slate-400">
              <th className="py-2">Kode</th>
              <th>Nama</th>
              <th>Kapasitas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.kode_ruang} className="border-t border-slate-100">
                <td className="py-2">{r.kode_ruang}</td>
                <td>{r.nama_ruang}</td>
                <td>{r.kapasitas ?? '-'}</td>
                <td className="flex gap-3 py-2">
                  <button type="button" onClick={() => handleEdit(r)} className="text-emerald-600 text-[10px] font-black uppercase flex items-center gap-1">
                    <Edit3 size={12} /> edit
                  </button>
                  <button type="button" onClick={() => handleDelete(r.kode_ruang)} className="text-red-600 text-[10px] font-black uppercase flex items-center gap-1">
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

export default InputRuang;
