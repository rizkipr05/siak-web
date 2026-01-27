import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import LoginAdmin from "../pages/auth/LoginAdmin"; 
import LoginPegawai from "../pages/auth/LoginPegawai";
import DashboardMhs from "../pages/mhs/Dashboard";
import DashboardDsn from "../pages/dsn/Dashboard"; 
import DashboardPgw from "../pages/pgw/Dashboard"; 
import IsiKRS from "../pages/mhs/IsiKRS";
import HasilKRS from "../pages/mhs/HasilKRS";
import CetakKHSMhs from "../pages/mhs/CetakKHS";
import ProfileMhs from "../pages/mhs/Profile";
import EditProfileMhs from "../pages/mhs/EditProfile";
import TranskripSementara from "../pages/mhs/TranskripSementara";
import AbsensiSaya from "../pages/mhs/AbsensiSaya";
import NilaiSaya from "../pages/mhs/NilaiSaya";
import Pertemuan from "../pages/dsn/Pertemuan";
import Absensi from "../pages/dsn/Absensi";
import InputNilai from "../pages/dsn/InputNilai"; 
import Bimbingan from "../pages/dsn/Bimbingan";
import ApprovalKRS from "../pages/dsn/ApprovalKRS";

// Import Halaman Baru Pegawai (Laporan)
import CetakKRS from "../pages/pgw/CetakKRS";
import CetakKHS from "../pages/pgw/CetakKHS";
import RekapAbsensi from "../pages/pgw/RekapAbsensi";

import InputMhs from "../pages/pgw/InputMhs";
import InputDosen from "../pages/pgw/InputDosen";
import InputMatkulPgw from "../pages/pgw/InputMatkul";
import InputRuangPgw from "../pages/pgw/InputRuang";
import InputJadwalPgw from "../pages/pgw/InputJadwal";
import AdminConsole from "../pages/admin/Console";
import AdminCetakKRS from "../pages/admin/CetakKRS";
import AdminCetakKHS from "../pages/admin/CetakKHS";
import AdminRekapAbsensi from "../pages/admin/RekapAbsensi";
import AdminInputMhs from "../pages/admin/InputMhs";
import AdminInputDosen from "../pages/admin/InputDosen";
import AdminInputMatkul from "../pages/admin/InputMatkul";
import AdminProfile from "../pages/admin/Profile";
import PegawaiProfile from "../pages/pgw/Profile";
import AdminEditProfile from "../pages/admin/EditProfile";
import PegawaiEditProfile from "../pages/pgw/EditProfile";
import DosenProfile from "../pages/dsn/Profile";
import DosenEditProfile from "../pages/dsn/EditProfile";


import MainLayout from "../components/layout/MainLayout";
import { RoleGuard } from "./RoleGuard";

/**
 * DashboardSelector berfungsi untuk mengarahkan user ke komponen Dashboard 
 * yang sesuai dengan role mereka setelah login sukses.
 */
const DashboardSelector = () => {
    const savedUser = localStorage.getItem('user');
    
    if (!savedUser) return <Navigate to="/" replace />;

    try {
        const user = JSON.parse(savedUser);
        const role = user.role?.toLowerCase();

        if (role === 'dosen') {
            return <DashboardDsn />;
        } else if (role === 'mahasiswa') {
            return <DashboardMhs />;
        } else if (role === 'pegawai' || role === 'admin') {
            return <DashboardPgw />; 
        }
        
        return <Navigate to="/" replace />;
    } catch (e) {
        return <Navigate to="/" replace />;
    }
};

const router = createBrowserRouter([
    // Route Login Utama (Mahasiswa & Dosen)
    { 
        path: "/", 
        element: <Login /> 
    },
    
    // Route Login Admin & Pegawai
    { 
        path: "/auth/login-admin", 
        element: <LoginAdmin /> 
    }, 
    { 
        path: "/auth/login-pegawai", 
        element: <LoginPegawai /> 
    }, 
    { 
        path: "/auth/LoginAdmin", 
        element: <LoginAdmin /> 
    }, 

    // Grup Route yang menggunakan MainLayout (Sidebar & Navbar)
    {
        element: <MainLayout />, 
        children: [
            // Entry point dashboard tunggal
            { 
                path: "/dashboard", 
                element: <DashboardSelector /> 
            },
            
            // --- ROUTE MAHASISWA ---
            { 
                path: "/isi-krs", 
                element: <RoleGuard role="mahasiswa"><IsiKRS /></RoleGuard> 
            },
            { 
                path: "/hasil-krs", 
                element: <RoleGuard role="mahasiswa"><HasilKRS /></RoleGuard> 
            },
            { 
                path: "/khs", 
                element: <RoleGuard role="mahasiswa"><CetakKHSMhs /></RoleGuard> 
            },
            { 
                path: "/profil", 
                element: <RoleGuard role="mahasiswa"><ProfileMhs /></RoleGuard> 
            },
            { 
                path: "/profil-edit", 
                element: <RoleGuard role="mahasiswa"><EditProfileMhs /></RoleGuard> 
            },
            { 
                path: "/transkrip-sementara", 
                element: <RoleGuard role="mahasiswa"><TranskripSementara /></RoleGuard> 
            },
            { 
                path: "/absensi-saya", 
                element: <RoleGuard role="mahasiswa"><AbsensiSaya /></RoleGuard> 
            },
            { 
                path: "/nilai-saya", 
                element: <RoleGuard role="mahasiswa"><NilaiSaya /></RoleGuard> 
            },
            
            // --- ROUTE DOSEN ---
            { 
                path: "/pertemuan", 
                element: <RoleGuard role="dosen"><Pertemuan /></RoleGuard> 
            },
            { 
                path: "/absensi", 
                element: <RoleGuard role="dosen"><Absensi /></RoleGuard> 
            },
            { 
                path: "/input-nilai", 
                element: <RoleGuard role="dosen"><InputNilai /></RoleGuard> 
            },
            { 
                path: "/dosen/profile", 
                element: <RoleGuard role="dosen"><DosenProfile /></RoleGuard> 
            },
            { 
                path: "/dosen/profile/edit", 
                element: <RoleGuard role="dosen"><DosenEditProfile /></RoleGuard> 
            },
            { 
                path: "/bimbingan", 
                element: <RoleGuard role="dosen"><Bimbingan /></RoleGuard> 
            },
            { 
                path: "/approval-krs", 
                element: <RoleGuard role="dosen"><ApprovalKRS /></RoleGuard> 
            },

            // --- ROUTE PEGAWAI / ADMIN (LAPORAN) ---
            { 
              path: "/reports/krs", 
              element: <RoleGuard role="pegawai"><CetakKRS /></RoleGuard> 
            },
            { 
              path: "/reports/khs", 
              element: <RoleGuard role="pegawai"><CetakKHS /></RoleGuard> 
            },
            { 
              path: "/reports/absensi", 
              element: <RoleGuard role="pegawai"><RekapAbsensi /></RoleGuard> 
            },

            { 
                path: "/master/mahasiswa", 
                element: <RoleGuard role="pegawai"><InputMhs /></RoleGuard> 
            },

            { 
                path: "/master/dosen", 
                element: <RoleGuard role="pegawai"><InputDosen /></RoleGuard> 
            },
            { 
                path: "/master/matakuliah", 
                element: <RoleGuard role="pegawai"><InputMatkulPgw /></RoleGuard> 
            },
            { 
                path: "/master/ruang", 
                element: <RoleGuard role="pegawai"><InputRuangPgw /></RoleGuard> 
            },
            { 
                path: "/master/jadwal", 
                element: <RoleGuard role="pegawai"><InputJadwalPgw /></RoleGuard> 
            },
            { 
                path: "/pegawai/profile", 
                element: <RoleGuard role="pegawai"><PegawaiProfile /></RoleGuard> 
            },
            { 
                path: "/pegawai/profile/edit", 
                element: <RoleGuard role="pegawai"><PegawaiEditProfile /></RoleGuard> 
            },

            // Route Umum Admin
            { 
              path: "/admin/console", 
              element: <RoleGuard role="admin"><AdminConsole /></RoleGuard> 
            },
            { 
              path: "/admin/reports/krs", 
              element: <RoleGuard role="admin"><AdminCetakKRS /></RoleGuard> 
            },
            { 
              path: "/admin/reports/khs", 
              element: <RoleGuard role="admin"><AdminCetakKHS /></RoleGuard> 
            },
            { 
              path: "/admin/reports/absensi", 
              element: <RoleGuard role="admin"><AdminRekapAbsensi /></RoleGuard> 
            },
            { 
              path: "/admin/master/mahasiswa", 
              element: <RoleGuard role="admin"><AdminInputMhs /></RoleGuard> 
            },
            { 
              path: "/admin/master/dosen", 
              element: <RoleGuard role="admin"><AdminInputDosen /></RoleGuard> 
            },
            { 
              path: "/admin/master/matakuliah", 
              element: <RoleGuard role="admin"><AdminInputMatkul /></RoleGuard> 
            },
            { 
              path: "/admin/profile", 
              element: <RoleGuard role="admin"><AdminProfile /></RoleGuard> 
            },
            { 
              path: "/admin/profile/edit", 
              element: <RoleGuard role="admin"><AdminEditProfile /></RoleGuard> 
            },
        ]
    },

    // Catch-all route
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);

export default router;
