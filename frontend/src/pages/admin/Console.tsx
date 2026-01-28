import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, Activity, Users, Settings, Calendar, FileText, ClipboardCheck, BookOpen, Database } from 'lucide-react';
import { ModalCustom } from '../../components/layout/ModalCustom';

const AdminConsole = () => {
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';
  const token = useMemo(() => localStorage.getItem('token'), []);

  const [activeTab, setActiveTab] = useState<'monitoring' | 'users' | 'periods' | 'krs' | 'khs' | 'nilai' | 'absensi'>('monitoring');

  const [summary, setSummary] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'pegawai', nama: '' });
  const [roleUpdate, setRoleUpdate] = useState({ id_user: '', role: 'pegawai' });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
  const [userEditModal, setUserEditModal] = useState<{ open: boolean; user: any | null; form: any }>({
    open: false,
    user: null,
    form: { username: '', password: '', nama: '', identifier: '' }
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const [periods, setPeriods] = useState<any[]>([]);
  const [newPeriod, setNewPeriod] = useState({ tahun_ajaran: '', semester: 'Ganjil' });
  const [periodEditModal, setPeriodEditModal] = useState<{ open: boolean; period: any | null }>({ open: false, period: null });
  const [periodDeleteModal, setPeriodDeleteModal] = useState<{ open: boolean; period: any | null }>({ open: false, period: null });

  const [krsFilters, setKrsFilters] = useState({ npm: '', status: '' });
  const [krsList, setKrsList] = useState<any[]>([]);
  const [krsUpdate, setKrsUpdate] = useState({ id_krs: '', status: 'Disetujui' });
  const [krsEditModal, setKrsEditModal] = useState<{ open: boolean; item: any | null; status: string }>({ open: false, item: null, status: 'Menunggu' });
  const [krsDeleteModal, setKrsDeleteModal] = useState<{ open: boolean; item: any | null }>({ open: false, item: null });

  const [khsNpm, setKhsNpm] = useState('');
  const [khsList, setKhsList] = useState<any[]>([]);
  const [khsEditModal, setKhsEditModal] = useState<{ open: boolean; item: any | null; values: { nsikap: string; ntugas: string; nuts: string; nuas: string } }>({
    open: false,
    item: null,
    values: { nsikap: '', ntugas: '', nuts: '', nuas: '' }
  });
  const [khsDeleteModal, setKhsDeleteModal] = useState<{ open: boolean; item: any | null }>({ open: false, item: null });

  const [nilaiFilters, setNilaiFilters] = useState({ npm: '', id_jadwal: '' });
  const [nilaiList, setNilaiList] = useState<any[]>([]);
  const [nilaiUpdate, setNilaiUpdate] = useState({ id_krs: '', nsikap: '', ntugas: '', nuts: '', nuas: '' });
  const [nilaiDeleteModal, setNilaiDeleteModal] = useState<{ open: boolean; item: any | null }>({ open: false, item: null });

  const [absensiFilters, setAbsensiFilters] = useState({ npm: '', id_jadwal: '' });
  const [absensiList, setAbsensiList] = useState<any[]>([]);
  const [absensiEditModal, setAbsensiEditModal] = useState<{ open: boolean; item: any | null; status: string }>({ open: false, item: null, status: 'Hadir' });
  const [absensiDeleteModal, setAbsensiDeleteModal] = useState<{ open: boolean; item: any | null }>({ open: false, item: null });

  const [actionLoading, setActionLoading] = useState(false);

  const fetchSummary = async () => {
    if (!token) return;
    const res = await fetch(`${apiBase}/api/admin/summary`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setSummary(data.data || null);
  };

  const fetchHealth = async () => {
    if (!token) return;
    const res = await fetch(`${apiBase}/api/admin/health`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setHealth(data.data || null);
  };

  const fetchUsers = async () => {
    if (!token) return;
    const res = await fetch(`${apiBase}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setUsers(Array.isArray(data.data) ? data.data : []);
  };

  const createUser = async () => {
    if (!token) return;
    await fetch(`${apiBase}/api/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newUser)
    });
    setNewUser({ username: '', password: '', role: 'pegawai', nama: '' });
    fetchUsers();
  };

  const updateRole = async () => {
    if (!token) return;
    await fetch(`${apiBase}/api/admin/users/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(roleUpdate)
    });
    fetchUsers();
  };

  const deleteUser = async (id_user: string) => {
    if (!token) return;
    setIsDeleting(true);
    try {
      await fetch(`${apiBase}/api/admin/users/${id_user}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } finally {
      setIsDeleting(false);
    }
  };

  const updateUserInfo = async (id_user: string, payload: any) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await fetch(`${apiBase}/api/admin/users/${id_user}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      fetchUsers();
    } finally {
      setActionLoading(false);
    }
  };

  const fetchPeriods = async () => {
    if (!token) return;
    const res = await fetch(`${apiBase}/api/admin/academic-periods`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setPeriods(Array.isArray(data.data) ? data.data : []);
  };

  const createPeriod = async () => {
    if (!token) return;
    await fetch(`${apiBase}/api/admin/academic-periods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newPeriod)
    });
    setNewPeriod({ tahun_ajaran: '', semester: 'Ganjil' });
    fetchPeriods();
  };

  const updatePeriod = async (id: number, payload: { tahun_ajaran: string; semester: string }) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await fetch(`${apiBase}/api/admin/academic-periods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      fetchPeriods();
    } finally {
      setActionLoading(false);
    }
  };

  const deletePeriod = async (id: number) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await fetch(`${apiBase}/api/admin/academic-periods/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPeriods();
    } finally {
      setActionLoading(false);
    }
  };

  const activatePeriod = async (id: number) => {
    if (!token) return;
    await fetch(`${apiBase}/api/admin/academic-periods/${id}/activate`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPeriods();
  };

  const fetchKrs = async () => {
    if (!token) return;
    const params = new URLSearchParams();
    if (krsFilters.npm) params.append('npm', krsFilters.npm);
    if (krsFilters.status) params.append('status', krsFilters.status);
    const res = await fetch(`${apiBase}/api/admin/krs?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setKrsList(Array.isArray(data.data) ? data.data : []);
  };

  const updateKrsStatus = async () => {
    if (!token) return;
    await fetch(`${apiBase}/api/admin/krs/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(krsUpdate)
    });
    fetchKrs();
  };

  const updateKrsStatusById = async (id_krs: string, status: string) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await fetch(`${apiBase}/api/admin/krs/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id_krs, status })
      });
      fetchKrs();
    } finally {
      setActionLoading(false);
    }
  };

  const deleteKrs = async (id_krs: string) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await fetch(`${apiBase}/api/admin/krs/${id_krs}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchKrs();
    } finally {
      setActionLoading(false);
    }
  };

  const fetchKhs = async () => {
    if (!token || !khsNpm) return;
    const res = await fetch(`${apiBase}/api/admin/khs?npm=${khsNpm}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setKhsList(Array.isArray(data.data) ? data.data : []);
  };

  const updateKhsNilai = async (id_krs: string, values: { nsikap: string; ntugas: string; nuts: string; nuas: string }) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await fetch(`${apiBase}/api/admin/nilai`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id_krs, ...values })
      });
      fetchKhs();
    } finally {
      setActionLoading(false);
    }
  };

  const deleteKhs = async (id_krs: string) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await fetch(`${apiBase}/api/admin/nilai/${id_krs}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchKhs();
    } finally {
      setActionLoading(false);
    }
  };

  const fetchNilai = async () => {
    if (!token) return;
    const params = new URLSearchParams();
    if (nilaiFilters.npm) params.append('npm', nilaiFilters.npm);
    if (nilaiFilters.id_jadwal) params.append('id_jadwal', nilaiFilters.id_jadwal);
    const res = await fetch(`${apiBase}/api/admin/nilai?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setNilaiList(Array.isArray(data.data) ? data.data : []);
  };

  const updateNilai = async () => {
    if (!token) return;
    await fetch(`${apiBase}/api/admin/nilai`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        id_krs: nilaiUpdate.id_krs,
        nsikap: nilaiUpdate.nsikap,
        ntugas: nilaiUpdate.ntugas,
        nuts: nilaiUpdate.nuts,
        nuas: nilaiUpdate.nuas
      })
    });
    fetchNilai();
  };

  const deleteNilai = async (id_krs: string) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await fetch(`${apiBase}/api/admin/nilai/${id_krs}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNilai();
    } finally {
      setActionLoading(false);
    }
  };

  const fetchAbsensi = async () => {
    if (!token) return;
    const params = new URLSearchParams();
    if (absensiFilters.npm) params.append('npm', absensiFilters.npm);
    if (absensiFilters.id_jadwal) params.append('id_jadwal', absensiFilters.id_jadwal);
    const res = await fetch(`${apiBase}/api/admin/absensi?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setAbsensiList(Array.isArray(data.data) ? data.data : []);
  };

  const updateAbsensi = async (id_absen: string, status_hadir: string) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await fetch(`${apiBase}/api/admin/absensi/${id_absen}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status_hadir })
      });
      fetchAbsensi();
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAbsensi = async (id_absen: string) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await fetch(`${apiBase}/api/admin/absensi/${id_absen}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAbsensi();
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'monitoring') {
      fetchSummary();
      fetchHealth();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'periods') {
      fetchPeriods();
    }
  }, [activeTab]);

  const tabs = [
    { key: 'monitoring', label: 'Monitoring', icon: <Activity size={16} /> },
    { key: 'users', label: 'Users & Akses', icon: <Users size={16} /> },
    { key: 'periods', label: 'Tahun Akademik', icon: <Calendar size={16} /> },
    { key: 'krs', label: 'KRS', icon: <ClipboardCheck size={16} /> },
    { key: 'khs', label: 'KHS', icon: <FileText size={16} /> },
    { key: 'nilai', label: 'Nilai', icon: <BookOpen size={16} /> },
    { key: 'absensi', label: 'Absensi', icon: <Database size={16} /> }
  ] as const;

  return (
    <div className="w-full space-y-8 pb-10">
      <div className="bg-slate-950 p-8 md:p-12 rounded-[2.5rem] text-white shadow-2xl border border-white/5 flex items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
            <ShieldCheck size={12} className="animate-pulse" /> ADMIN CONSOLE
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Administrasi Sistem</h1>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Maintenance <span>•</span> Monitoring <span>•</span> Control
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
              activeTab === t.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-100 text-slate-500'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'monitoring' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity size={18} className="text-indigo-600" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Monitoring</p>
            </div>
            <pre className="text-xs text-slate-600 whitespace-pre-wrap">{JSON.stringify(summary, null, 2)}</pre>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings size={18} className="text-indigo-600" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Maintenance</p>
            </div>
            <pre className="text-xs text-slate-600 whitespace-pre-wrap">{JSON.stringify(health, null, 2)}</pre>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Buat User</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              <select className="h-12 px-4 rounded-xl bg-slate-50" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="pegawai">pegawai</option>
                <option value="admin">admin</option>
                <option value="mahasiswa">mahasiswa</option>
                <option value="dosen">dosen</option>
              </select>
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="Nama" value={newUser.nama} onChange={(e) => setNewUser({ ...newUser, nama: e.target.value })} />
            </div>
            <button onClick={createUser} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">Simpan</button>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hak Akses (Admin/Pegawai)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="ID User" value={roleUpdate.id_user} onChange={(e) => setRoleUpdate({ ...roleUpdate, id_user: e.target.value })} />
              <select className="h-12 px-4 rounded-xl bg-slate-50" value={roleUpdate.role} onChange={(e) => setRoleUpdate({ ...roleUpdate, role: e.target.value })}>
                <option value="pegawai">pegawai</option>
                <option value="admin">admin</option>
              </select>
              <button onClick={updateRole} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">Update</button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Daftar Users</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-slate-400">
                    <th className="py-2">ID</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Nama</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id_user} className="border-t border-slate-100">
                      <td className="py-2">{u.id_user}</td>
                      <td>{u.username}</td>
                      <td>{u.role}</td>
                      <td>{u.nama || '-'}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              setUserEditModal({
                                open: true,
                                user: u,
                                form: {
                                  username: u.username || '',
                                  password: '',
                                  nama: u.nama || '',
                                  identifier: u.id_user || ''
                                }
                              })
                            }
                            className="text-slate-700 text-[10px] font-black uppercase"
                          >
                            edit
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, user: u })}
                            className="text-red-600 text-[10px] font-black uppercase"
                          >
                            hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'periods' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tambah Periode</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="2025/2026" value={newPeriod.tahun_ajaran} onChange={(e) => setNewPeriod({ ...newPeriod, tahun_ajaran: e.target.value })} />
              <select className="h-12 px-4 rounded-xl bg-slate-50" value={newPeriod.semester} onChange={(e) => setNewPeriod({ ...newPeriod, semester: e.target.value })}>
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
              <button onClick={createPeriod} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">Simpan</button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Daftar Periode</p>
            <div className="space-y-2">
              {periods.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-bold text-slate-700">{p.tahun_ajaran} • {p.semester}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => activatePeriod(p.id)}
                      className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${p.aktif ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'}`}
                    >
                      {p.aktif ? 'aktif' : 'set aktif'}
                    </button>
                    <button
                      onClick={() => setPeriodEditModal({ open: true, period: p })}
                      className="text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-slate-900 text-white"
                    >
                      edit
                    </button>
                    <button
                      onClick={() => setPeriodDeleteModal({ open: true, period: p })}
                      className="text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-red-600 text-white"
                    >
                      hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'krs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filter KRS</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="NPM" value={krsFilters.npm} onChange={(e) => setKrsFilters({ ...krsFilters, npm: e.target.value })} />
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="Status (Menunggu/Disetujui/Ditolak)" value={krsFilters.status} onChange={(e) => setKrsFilters({ ...krsFilters, status: e.target.value })} />
              <button onClick={fetchKrs} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">Cari</button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Update Status KRS</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="ID KRS" value={krsUpdate.id_krs} onChange={(e) => setKrsUpdate({ ...krsUpdate, id_krs: e.target.value })} />
              <select className="h-12 px-4 rounded-xl bg-slate-50" value={krsUpdate.status} onChange={(e) => setKrsUpdate({ ...krsUpdate, status: e.target.value })}>
                <option value="Menunggu">Menunggu</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>
              <button onClick={updateKrsStatus} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">Update</button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="py-2">ID</th>
                  <th>NPM</th>
                  <th>Matkul</th>
                  <th>Kelas</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {krsList.map((k) => (
                  <tr key={k.id_krs} className="border-t border-slate-100">
                    <td className="py-2">{k.id_krs}</td>
                    <td>{k.NPM}</td>
                    <td>{k.NamaMatkul}</td>
                    <td>{k.Kelas}</td>
                    <td>{k.status_verifikasi || 'Menunggu'}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setKrsEditModal({ open: true, item: k, status: k.status_verifikasi || 'Menunggu' })}
                          className="text-[10px] font-black uppercase text-slate-700"
                        >
                          edit
                        </button>
                        <button
                          onClick={() => setKrsDeleteModal({ open: true, item: k })}
                          className="text-[10px] font-black uppercase text-red-600"
                        >
                          hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'khs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cari KHS</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="NPM" value={khsNpm} onChange={(e) => setKhsNpm(e.target.value)} />
              <button onClick={fetchKhs} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">Cari</button>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="py-2">ID</th>
                  <th className="py-2">Matkul</th>
                  <th>SKS</th>
                  <th>NA</th>
                  <th>Huruf</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {khsList.map((k, idx) => (
                  <tr key={`${k.id_krs}-${idx}`} className="border-t border-slate-100">
                    <td className="py-2">{k.id_krs}</td>
                    <td className="py-2">{k.NamaMatkul}</td>
                    <td>{k.SKS}</td>
                    <td>{k.NA}</td>
                    <td>{k.Huruf}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setKhsEditModal({
                              open: true,
                              item: k,
                              values: {
                                nsikap: String(k.nsikap ?? ''),
                                ntugas: String(k.ntugas ?? ''),
                                nuts: String(k.nuts ?? ''),
                                nuas: String(k.nuas ?? '')
                              }
                            })
                          }
                          className="text-[10px] font-black uppercase text-slate-700"
                        >
                          edit
                        </button>
                        <button
                          onClick={() => setKhsDeleteModal({ open: true, item: k })}
                          className="text-[10px] font-black uppercase text-red-600"
                        >
                          hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'nilai' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filter Nilai</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="NPM" value={nilaiFilters.npm} onChange={(e) => setNilaiFilters({ ...nilaiFilters, npm: e.target.value })} />
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="ID Jadwal" value={nilaiFilters.id_jadwal} onChange={(e) => setNilaiFilters({ ...nilaiFilters, id_jadwal: e.target.value })} />
              <button onClick={fetchNilai} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">Cari</button>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Update Nilai</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="ID KRS" value={nilaiUpdate.id_krs} onChange={(e) => setNilaiUpdate({ ...nilaiUpdate, id_krs: e.target.value })} />
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="Sikap" value={nilaiUpdate.nsikap} onChange={(e) => setNilaiUpdate({ ...nilaiUpdate, nsikap: e.target.value })} />
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="Tugas" value={nilaiUpdate.ntugas} onChange={(e) => setNilaiUpdate({ ...nilaiUpdate, ntugas: e.target.value })} />
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="UTS" value={nilaiUpdate.nuts} onChange={(e) => setNilaiUpdate({ ...nilaiUpdate, nuts: e.target.value })} />
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="UAS" value={nilaiUpdate.nuas} onChange={(e) => setNilaiUpdate({ ...nilaiUpdate, nuas: e.target.value })} />
            </div>
            <button onClick={updateNilai} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">Simpan</button>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="py-2">ID KRS</th>
                  <th>NPM</th>
                  <th>Matkul</th>
                  <th>SKS</th>
                  <th>Sikap</th>
                  <th>Tugas</th>
                  <th>UTS</th>
                  <th>UAS</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {nilaiList.map((n) => (
                  <tr key={n.id_krs} className="border-t border-slate-100">
                    <td className="py-2">{n.id_krs}</td>
                    <td>{n.NPM}</td>
                    <td>{n.NamaMatkul}</td>
                    <td>{n.Kelas}</td>
                    <td>{n.nsikap}</td>
                    <td>{n.ntugas}</td>
                    <td>{n.nuts}</td>
                    <td>{n.nuas}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setNilaiUpdate({
                              id_krs: n.id_krs,
                              nsikap: n.nsikap ?? '',
                              ntugas: n.ntugas ?? '',
                              nuts: n.nuts ?? '',
                              nuas: n.nuas ?? ''
                            })
                          }
                          className="text-[10px] font-black uppercase text-slate-700"
                        >
                          edit
                        </button>
                        <button
                          onClick={() => setNilaiDeleteModal({ open: true, item: n })}
                          className="text-[10px] font-black uppercase text-red-600"
                        >
                          hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'absensi' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filter Absensi</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="NPM" value={absensiFilters.npm} onChange={(e) => setAbsensiFilters({ ...absensiFilters, npm: e.target.value })} />
              <input className="h-12 px-4 rounded-xl bg-slate-50" placeholder="ID Jadwal" value={absensiFilters.id_jadwal} onChange={(e) => setAbsensiFilters({ ...absensiFilters, id_jadwal: e.target.value })} />
              <button onClick={fetchAbsensi} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">Cari</button>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="py-2">NPM</th>
                  <th>Mahasiswa</th>
                  <th>Matkul</th>
                  <th>Pertemuan</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {absensiList.map((a) => (
                  <tr key={a.id_absen} className="border-t border-slate-100">
                    <td className="py-2">{a.NPM}</td>
                    <td>{a.NamaMahasiswa}</td>
                    <td>{a.NamaMatkul}</td>
                    <td>{a.pertemuan_ke}</td>
                    <td>{a.status_hadir}</td>
                    <td>{a.tanggal?.slice(0, 10)}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAbsensiEditModal({ open: true, item: a, status: a.status_hadir || 'Hadir' })}
                          className="text-[10px] font-black uppercase text-slate-700"
                        >
                          edit
                        </button>
                        <button
                          onClick={() => setAbsensiDeleteModal({ open: true, item: a })}
                          className="text-[10px] font-black uppercase text-red-600"
                        >
                          hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ModalCustom
        isOpen={deleteModal.open}
        variant="danger"
        title="Hapus User?"
        message={
          deleteModal.user
            ? `User ${deleteModal.user.username} (${deleteModal.user.id_user}) akan dihapus permanen.`
            : 'User akan dihapus permanen.'
        }
        confirmText={isDeleting ? 'MENGHAPUS...' : 'YA, HAPUS'}
        onClose={() => !isDeleting && setDeleteModal({ open: false, user: null })}
        onConfirm={() => {
          if (!deleteModal.user || isDeleting) return;
          deleteUser(deleteModal.user.id_user);
          setDeleteModal({ open: false, user: null });
        }}
      />

      <ModalCustom
        isOpen={userEditModal.open}
        variant="warning"
        title="Edit User?"
        message={
          userEditModal.user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              <input
                className="h-12 px-4 rounded-xl bg-slate-50"
                placeholder="Username"
                value={userEditModal.form.username}
                onChange={(e) => setUserEditModal({ ...userEditModal, form: { ...userEditModal.form, username: e.target.value } })}
              />
              <input
                className="h-12 px-4 rounded-xl bg-slate-50"
                placeholder="Password (kosongkan jika tidak diubah)"
                value={userEditModal.form.password}
                onChange={(e) => setUserEditModal({ ...userEditModal, form: { ...userEditModal.form, password: e.target.value } })}
              />
              <input
                className="h-12 px-4 rounded-xl bg-slate-50"
                placeholder="Nama"
                value={userEditModal.form.nama}
                onChange={(e) => setUserEditModal({ ...userEditModal, form: { ...userEditModal.form, nama: e.target.value } })}
              />
              <input
                className="h-12 px-4 rounded-xl bg-slate-50"
                placeholder={userEditModal.user.role === 'mahasiswa' ? 'NPM' : userEditModal.user.role === 'dosen' ? 'NIDN' : userEditModal.user.role === 'pegawai' ? 'NIP' : 'ID'}
                value={userEditModal.form.identifier}
                onChange={(e) => setUserEditModal({ ...userEditModal, form: { ...userEditModal.form, identifier: e.target.value } })}
              />
            </div>
          ) : (
            'User tidak ditemukan.'
          )
        }
        confirmText={actionLoading ? 'MENYIMPAN...' : 'SIMPAN'}
        onClose={() =>
          !actionLoading &&
          setUserEditModal({ open: false, user: null, form: { username: '', password: '', nama: '', identifier: '' } })
        }
        onConfirm={() => {
          if (!userEditModal.user || actionLoading) return;
          const payload: any = {
            username: userEditModal.form.username,
            nama: userEditModal.form.nama
          };
          if (userEditModal.form.password.trim() !== '') {
            payload.password = userEditModal.form.password;
          }
          if (userEditModal.user.role === 'mahasiswa') payload.npm = userEditModal.form.identifier;
          if (userEditModal.user.role === 'dosen') payload.nidn = userEditModal.form.identifier;
          if (userEditModal.user.role === 'pegawai') payload.nip = userEditModal.form.identifier;
          if (userEditModal.user.role === 'admin') payload.nama_admin = userEditModal.form.nama;

          updateUserInfo(userEditModal.user.id_user, payload);
          setUserEditModal({ open: false, user: null, form: { username: '', password: '', nama: '', identifier: '' } });
        }}
      />

      <ModalCustom
        isOpen={periodEditModal.open}
        variant="warning"
        title="Edit Periode?"
        message={
          periodEditModal.period ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              <input
                className="h-12 px-4 rounded-xl bg-slate-50"
                placeholder="2025/2026"
                value={periodEditModal.period.tahun_ajaran || ''}
                onChange={(e) =>
                  setPeriodEditModal({
                    open: true,
                    period: { ...periodEditModal.period, tahun_ajaran: e.target.value }
                  })
                }
              />
              <select
                className="h-12 px-4 rounded-xl bg-slate-50"
                value={periodEditModal.period.semester || 'Ganjil'}
                onChange={(e) =>
                  setPeriodEditModal({
                    open: true,
                    period: { ...periodEditModal.period, semester: e.target.value }
                  })
                }
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          ) : (
            'Periode tidak ditemukan.'
          )
        }
        confirmText={actionLoading ? 'MENYIMPAN...' : 'SIMPAN'}
        onClose={() => !actionLoading && setPeriodEditModal({ open: false, period: null })}
        onConfirm={() => {
          if (!periodEditModal.period || actionLoading) return;
          updatePeriod(periodEditModal.period.id, {
            tahun_ajaran: periodEditModal.period.tahun_ajaran,
            semester: periodEditModal.period.semester
          });
          setPeriodEditModal({ open: false, period: null });
        }}
      />

      <ModalCustom
        isOpen={periodDeleteModal.open}
        variant="danger"
        title="Hapus Periode?"
        message={
          periodDeleteModal.period
            ? `Periode ${periodDeleteModal.period.tahun_ajaran} • ${periodDeleteModal.period.semester} akan dihapus.`
            : 'Periode akan dihapus.'
        }
        confirmText={actionLoading ? 'MENGHAPUS...' : 'YA, HAPUS'}
        onClose={() => !actionLoading && setPeriodDeleteModal({ open: false, period: null })}
        onConfirm={() => {
          if (!periodDeleteModal.period || actionLoading) return;
          deletePeriod(periodDeleteModal.period.id);
          setPeriodDeleteModal({ open: false, period: null });
        }}
      />

      <ModalCustom
        isOpen={krsEditModal.open}
        variant="warning"
        title="Edit Status KRS?"
        message={
          <div className="grid grid-cols-1 gap-3 text-left">
            <select
              className="h-12 px-4 rounded-xl bg-slate-50"
              value={krsEditModal.status}
              onChange={(e) => setKrsEditModal({ ...krsEditModal, status: e.target.value })}
            >
              <option value="Menunggu">Menunggu</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        }
        confirmText={actionLoading ? 'MENGUPDATE...' : 'UPDATE'}
        onClose={() => !actionLoading && setKrsEditModal({ open: false, item: null, status: 'Menunggu' })}
        onConfirm={() => {
          if (!krsEditModal.item || actionLoading) return;
          updateKrsStatusById(krsEditModal.item.id_krs, krsEditModal.status);
          setKrsEditModal({ open: false, item: null, status: 'Menunggu' });
        }}
      />

      <ModalCustom
        isOpen={krsDeleteModal.open}
        variant="danger"
        title="Hapus KRS?"
        message={
          krsDeleteModal.item
            ? `KRS ${krsDeleteModal.item.id_krs} untuk ${krsDeleteModal.item.NPM} akan dihapus.`
            : 'KRS akan dihapus.'
        }
        confirmText={actionLoading ? 'MENGHAPUS...' : 'YA, HAPUS'}
        onClose={() => !actionLoading && setKrsDeleteModal({ open: false, item: null })}
        onConfirm={() => {
          if (!krsDeleteModal.item || actionLoading) return;
          deleteKrs(krsDeleteModal.item.id_krs);
          setKrsDeleteModal({ open: false, item: null });
        }}
      />

      <ModalCustom
        isOpen={khsEditModal.open}
        variant="warning"
        title="Edit Nilai KHS?"
        message={
          khsEditModal.item ? (
            <div className="grid grid-cols-2 gap-3 text-left">
              <input
                className="h-12 px-4 rounded-xl bg-slate-50"
                placeholder="Sikap"
                value={khsEditModal.values.nsikap}
                onChange={(e) => setKhsEditModal({ ...khsEditModal, values: { ...khsEditModal.values, nsikap: e.target.value } })}
              />
              <input
                className="h-12 px-4 rounded-xl bg-slate-50"
                placeholder="Tugas"
                value={khsEditModal.values.ntugas}
                onChange={(e) => setKhsEditModal({ ...khsEditModal, values: { ...khsEditModal.values, ntugas: e.target.value } })}
              />
              <input
                className="h-12 px-4 rounded-xl bg-slate-50"
                placeholder="UTS"
                value={khsEditModal.values.nuts}
                onChange={(e) => setKhsEditModal({ ...khsEditModal, values: { ...khsEditModal.values, nuts: e.target.value } })}
              />
              <input
                className="h-12 px-4 rounded-xl bg-slate-50"
                placeholder="UAS"
                value={khsEditModal.values.nuas}
                onChange={(e) => setKhsEditModal({ ...khsEditModal, values: { ...khsEditModal.values, nuas: e.target.value } })}
              />
            </div>
          ) : (
            'Data KHS tidak ditemukan.'
          )
        }
        confirmText={actionLoading ? 'MENGUPDATE...' : 'UPDATE'}
        onClose={() =>
          !actionLoading &&
          setKhsEditModal({ open: false, item: null, values: { nsikap: '', ntugas: '', nuts: '', nuas: '' } })
        }
        onConfirm={() => {
          if (!khsEditModal.item || actionLoading) return;
          updateKhsNilai(khsEditModal.item.id_krs, khsEditModal.values);
          setKhsEditModal({ open: false, item: null, values: { nsikap: '', ntugas: '', nuts: '', nuas: '' } });
        }}
      />

      <ModalCustom
        isOpen={khsDeleteModal.open}
        variant="danger"
        title="Hapus KHS?"
        message={
          khsDeleteModal.item
            ? `KHS ${khsDeleteModal.item.id_krs} akan dihapus.`
            : 'KHS akan dihapus.'
        }
        confirmText={actionLoading ? 'MENGHAPUS...' : 'YA, HAPUS'}
        onClose={() => !actionLoading && setKhsDeleteModal({ open: false, item: null })}
        onConfirm={() => {
          if (!khsDeleteModal.item || actionLoading) return;
          deleteKhs(khsDeleteModal.item.id_krs);
          setKhsDeleteModal({ open: false, item: null });
        }}
      />

      <ModalCustom
        isOpen={nilaiDeleteModal.open}
        variant="danger"
        title="Hapus Nilai?"
        message={
          nilaiDeleteModal.item
            ? `Nilai untuk KRS ${nilaiDeleteModal.item.id_krs} akan dihapus.`
            : 'Nilai akan dihapus.'
        }
        confirmText={actionLoading ? 'MENGHAPUS...' : 'YA, HAPUS'}
        onClose={() => !actionLoading && setNilaiDeleteModal({ open: false, item: null })}
        onConfirm={() => {
          if (!nilaiDeleteModal.item || actionLoading) return;
          deleteNilai(nilaiDeleteModal.item.id_krs);
          setNilaiDeleteModal({ open: false, item: null });
        }}
      />

      <ModalCustom
        isOpen={absensiEditModal.open}
        variant="warning"
        title="Edit Absensi?"
        message={
          <div className="grid grid-cols-1 gap-3 text-left">
            <select
              className="h-12 px-4 rounded-xl bg-slate-50"
              value={absensiEditModal.status}
              onChange={(e) => setAbsensiEditModal({ ...absensiEditModal, status: e.target.value })}
            >
              <option value="Hadir">Hadir</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
              <option value="Alfa">Alfa</option>
            </select>
          </div>
        }
        confirmText={actionLoading ? 'MENGUPDATE...' : 'UPDATE'}
        onClose={() => !actionLoading && setAbsensiEditModal({ open: false, item: null, status: 'Hadir' })}
        onConfirm={() => {
          if (!absensiEditModal.item || actionLoading) return;
          updateAbsensi(absensiEditModal.item.id_absen, absensiEditModal.status);
          setAbsensiEditModal({ open: false, item: null, status: 'Hadir' });
        }}
      />

      <ModalCustom
        isOpen={absensiDeleteModal.open}
        variant="danger"
        title="Hapus Absensi?"
        message={
          absensiDeleteModal.item
            ? `Absensi ${absensiDeleteModal.item.id_absen} akan dihapus.`
            : 'Absensi akan dihapus.'
        }
        confirmText={actionLoading ? 'MENGHAPUS...' : 'YA, HAPUS'}
        onClose={() => !actionLoading && setAbsensiDeleteModal({ open: false, item: null })}
        onConfirm={() => {
          if (!absensiDeleteModal.item || actionLoading) return;
          deleteAbsensi(absensiDeleteModal.item.id_absen);
          setAbsensiDeleteModal({ open: false, item: null });
        }}
      />
    </div>
  );
};

export default AdminConsole;
