const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const identifier = req.body.identifier ? req.body.identifier.toString().trim() : "";
    const password = req.body.password ? req.body.password.toString().trim() : "";
    const requestedRole = req.body.role;

    try {
        const [userRows] = await db.query(
            `SELECT * FROM users WHERE username = ? AND role = ?`, 
            [identifier, requestedRole]
        );

        if (userRows.length === 0) {
            return res.status(401).json({ success: false, message: 'Akun tidak ditemukan atau role salah' });
        }

        const userAccount = userRows[0];
        let isMatch = false;

        if (userAccount.password.startsWith('$2')) {
            isMatch = await bcrypt.compare(password, userAccount.password);
        } else {
            isMatch = (password === userAccount.password);
        }
        
        console.log(`[AUTH] Login: ${identifier} | Role: ${requestedRole} | Match: ${isMatch}`);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Password salah' });
        }

        let profileName = 'User';
        let additionalData = {};

        if (requestedRole === 'mahasiswa') {
            const [mhs] = await db.query("SELECT Nama, NPM FROM mahasiswa WHERE id_user = ?", [userAccount.id_user]);
            if (mhs.length > 0) { profileName = mhs[0].Nama; additionalData = { npm: mhs[0].NPM }; }
        } else if (requestedRole === 'dosen') {
            const [dsn] = await db.query("SELECT Nama, NIDN FROM dosen WHERE id_user = ?", [userAccount.id_user]);
            if (dsn.length > 0) { profileName = dsn[0].Nama; additionalData = { nidn: dsn[0].NIDN }; }
        } else if (requestedRole === 'pegawai') {
            const [pgw] = await db.query("SELECT Nama, NIP FROM pegawai WHERE id_user = ?", [userAccount.id_user]);
            if (pgw.length > 0) { profileName = pgw[0].Nama; additionalData = { nip: pgw[0].NIP }; }
        } else if (requestedRole === 'admin') {
            const [adm] = await db.query("SELECT nama_admin FROM admin WHERE id_user = ?", [userAccount.id_user]);
            if (adm.length > 0) { profileName = adm[0].nama_admin; }
        }

        const token = jwt.sign(
            { id_user: userAccount.id_user, role: userAccount.role },
            'RAHASIA_JWT_ANDA', 
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            token,
            user: { id: identifier, nama: profileName, role: userAccount.role, ...additionalData }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const registerStaff = async (req, res) => {
    const { username, password, role, nama, detail, jenis_kelamin } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password.toString().trim(), 10);
        const [result] = await db.query(
            "INSERT INTO users (id_user, username, password, role) VALUES (NULL, ?, ?, ?)",
            [username, hashedPassword, role]
        );
        const newIdUser = result.insertId;
        if (role === 'admin') {
            await db.query("INSERT INTO admin (nama_admin, email, id_user) VALUES (?, ?, ?)", [nama, detail, newIdUser]);
        } else if (role === 'pegawai') {
            await db.query("INSERT INTO pegawai (NIP, Nama, Jabatan, JenisKelamin, id_user) VALUES (?, ?, ?, ?, ?)", [detail, nama, 'Staf', jenis_kelamin, newIdUser]);
        }
        res.status(201).json({ success: true, message: 'Registrasi Berhasil' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal Registrasi' });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const [mhs] = await db.query("SELECT COUNT(*) as total FROM mahasiswa");
        const [dsn] = await db.query("SELECT COUNT(*) as total FROM dosen");
        res.json({ success: true, data: { totalMahasiswa: mhs[0].total, totalDosen: dsn[0].total } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal' });
    }
};

module.exports = { login, registerStaff, getDashboardStats };