import React from "react";
import { Navigate } from "react-router-dom";

interface RoleGuardProps {
    children: React.ReactNode; 
    // Tambahkan 'pegawai' dan 'admin' di sini
    role: 'mahasiswa' | 'dosen' | 'pegawai' | 'admin';
}

export const RoleGuard = ({ children, role }: RoleGuardProps) => {
    const savedUser = localStorage.getItem('user');
    
    if (!savedUser) return <Navigate to="/" replace />;

    try {
        const user = JSON.parse(savedUser);
        const userRole = user.role?.toLowerCase();

        // Validasi apakah role user yang login sama dengan role yang diizinkan di route
        if (userRole !== role) {
            return <Navigate to="/dashboard" replace />;
        }

        return <>{children}</>;
    } catch (error) {
        localStorage.clear();
        return <Navigate to="/" replace />;
    }
};