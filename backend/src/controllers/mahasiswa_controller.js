const db = require('../config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const normalizeJenisKelamin = (value) => {
    if (!value) return '';
    const v = value.toString().trim().toLowerCase();
    if (v === 'l' || v === 'laki-laki' || v === 'laki laki') return 'L';
    if (v === 'p' || v === 'perempuan') return 'P';
    return value;
};

const displayJenisKelamin = (value) => {
    const v = (value || '').toString().trim().toUpperCase();
    if (v === 'L') return 'Laki-laki';
    if (v === 'P') return 'Perempuan';
    return value;
};

const getProfile = async (req, res) => {
    const { id_user } = req.user || {};
    if (!id_user) {
        return res.status(401).json({ success: false, message: 'User tidak valid' });
    }
    try {
        const [rows] = await db.query(`
            SELECT 
                m.NPM,
                m.Nama,
                m.JenisKelamin,
                m.TglLahir,
                m.Prodi,
                m.Foto,
                m.NIDN_Wali,
                d.Nama AS NamaWali
            FROM mahasiswa m
            LEFT JOIN dosen d ON m.NIDN_Wali = d.NIDN
            WHERE m.id_user = ?
            LIMIT 1
        `, [id_user]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Profil mahasiswa tidak ditemukan' });
        }
        const data = rows[0];
        res.json({ success: true, data: { ...data, JenisKelamin: displayJenisKelamin(data.JenisKelamin) } });
    } catch (error) {
        console.error('[ERROR] getProfile:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { id_user } = req.user || {};
    if (!id_user) {
        return res.status(401).json({ success: false, message: 'User tidak valid' });
    }

    const { Nama, JenisKelamin, TglLahir, Prodi, password } = req.body;
    const jk = normalizeJenisKelamin(JenisKelamin);

    try {
        const [rows] = await db.query(`SELECT NPM FROM mahasiswa WHERE id_user = ? LIMIT 1`, [id_user]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
        }

        await db.query(`
            UPDATE mahasiswa 
            SET Nama = ?, JenisKelamin = ?, TglLahir = ?, Prodi = ?
            WHERE id_user = ?
        `, [Nama, jk || null, TglLahir || null, Prodi || null, id_user]);

        if (password && password.toString().trim() !== "") {
            const hashedPassword = await bcrypt.hash(password.toString().trim(), 10);
            await db.query(`UPDATE users SET password = ? WHERE id_user = ?`, [hashedPassword, id_user]);
        }

        res.json({ success: true, message: 'Profil berhasil diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateProfile:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getKHS = async (req, res) => {
    const { id_user } = req.user || {};
    if (!id_user) {
        return res.status(401).json({ success: false, message: 'User tidak valid' });
    }
    try {
        const [mhs] = await db.query(`SELECT NPM, Nama, Prodi FROM mahasiswa WHERE id_user = ? LIMIT 1`, [id_user]);
        if (mhs.length === 0) {
            return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
        }

        const npm = mhs[0].NPM;
        const [rows] = await db.query(`
            SELECT v.*, m.Nama, m.Prodi 
            FROM v_khs v
            JOIN mahasiswa m ON v.NPM = m.NPM
            WHERE v.NPM = ?
        `, [npm]);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[ERROR] getKHS:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfilePhoto = async (req, res) => {
    const { id_user } = req.user || {};
    if (!id_user) {
        return res.status(401).json({ success: false, message: 'User tidak valid' });
    }
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'File foto tidak ditemukan' });
    }

    try {
        const [rows] = await db.query(`SELECT Foto FROM mahasiswa WHERE id_user = ? LIMIT 1`, [id_user]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
        }

        const oldFoto = rows[0].Foto;
        const newFoto = req.file.filename;

        await db.query(`UPDATE mahasiswa SET Foto = ? WHERE id_user = ?`, [newFoto, id_user]);

        if (oldFoto && oldFoto !== 'default_mhs.jpg') {
            const oldPath = path.join(__dirname, '../uploads/', oldFoto);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        res.json({ success: true, message: 'Foto profil diperbarui', data: { Foto: newFoto } });
    } catch (error) {
        console.error('[ERROR] updateProfilePhoto:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTranscriptSementara = async (req, res) => {
    const { id_user } = req.user || {};
    if (!id_user) {
        return res.status(401).json({ success: false, message: 'User tidak valid' });
    }
    try {
        const [mhs] = await db.query(`SELECT NPM, Nama, Prodi FROM mahasiswa WHERE id_user = ? LIMIT 1`, [id_user]);
        if (mhs.length === 0) {
            return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
        }
        const npm = mhs[0].NPM;
        const [rows] = await db.query(`
            SELECT 
                k.id_krs,
                k.id_jadwal,
                m.KodeMK,
                m.NamaMatkul,
                m.SKS,
                k.nsikap,
                k.ntugas,
                k.nuts,
                k.nuas,
                (
                    0.1 * COALESCE(k.nsikap, 0) +
                    0.3 * COALESCE(k.ntugas, 0) +
                    0.25 * COALESCE(k.nuts, 0) +
                    0.35 * COALESCE(k.nuas, 0)
                ) AS NA
            FROM krsnil k
            JOIN jadwal j ON k.id_jadwal = j.id_jadwal
            JOIN matakuliah m ON j.KodeMK = m.KodeMK
            WHERE k.NPM = ?
            ORDER BY m.Semester ASC, m.NamaMatkul ASC
        `, [npm]);

        res.json({ success: true, data: rows, mahasiswa: mhs[0] });
    } catch (error) {
        console.error('[ERROR] getTranscriptSementara:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyAbsensi = async (req, res) => {
    const { id_user } = req.user || {};
    if (!id_user) {
        return res.status(401).json({ success: false, message: 'User tidak valid' });
    }
    try {
        const [mhs] = await db.query(`SELECT NPM FROM mahasiswa WHERE id_user = ? LIMIT 1`, [id_user]);
        if (mhs.length === 0) {
            return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
        }
        const npm = mhs[0].NPM;
        const [rows] = await db.query(`
            SELECT 
                a.status_hadir,
                p.id_pertemuan,
                p.pertemuan_ke,
                p.tanggal,
                j.id_jadwal,
                j.Kelas,
                mk.KodeMK,
                mk.NamaMatkul
            FROM absensi a
            JOIN pertemuan p ON a.id_pertemuan = p.id_pertemuan
            JOIN jadwal j ON p.id_jadwal = j.id_jadwal
            JOIN matakuliah mk ON j.KodeMK = mk.KodeMK
            WHERE a.NPM = ?
            ORDER BY p.tanggal DESC
        `, [npm]);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[ERROR] getMyAbsensi:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyNilai = async (req, res) => {
    const { id_user } = req.user || {};
    if (!id_user) {
        return res.status(401).json({ success: false, message: 'User tidak valid' });
    }
    try {
        const [mhs] = await db.query(`SELECT NPM FROM mahasiswa WHERE id_user = ? LIMIT 1`, [id_user]);
        if (mhs.length === 0) {
            return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
        }
        const npm = mhs[0].NPM;
        const [rows] = await db.query(`
            SELECT 
                k.id_krs,
                k.id_jadwal,
                mk.KodeMK,
                mk.NamaMatkul,
                j.Kelas,
                k.nsikap,
                k.ntugas,
                k.nuts,
                k.nuas,
                (
                    0.1 * COALESCE(k.nsikap, 0) +
                    0.3 * COALESCE(k.ntugas, 0) +
                    0.25 * COALESCE(k.nuts, 0) +
                    0.35 * COALESCE(k.nuas, 0)
                ) AS NA
            FROM krsnil k
            JOIN jadwal j ON k.id_jadwal = j.id_jadwal
            JOIN matakuliah mk ON j.KodeMK = mk.KodeMK
            WHERE k.NPM = ?
            ORDER BY mk.NamaMatkul ASC
        `, [npm]);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[ERROR] getMyNilai:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { 
    getProfile, 
    updateProfile, 
    getKHS, 
    updateProfilePhoto,
    getTranscriptSementara,
    getMyAbsensi,
    getMyNilai
};
