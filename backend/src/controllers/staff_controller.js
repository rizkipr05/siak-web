const db = require('../config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const getCetakKRS = async (req, res) => {
    const { npm } = req.query;
    try {
        const [rows] = await db.query(`
            SELECT 
                m.Nama, m.NPM, m.Prodi, 
                mk.NamaMatkul, mk.SKS, mk.KodeMK,
                j.Kelas, j.Hari, j.Jam,
                d.Nama as DosenWali
            FROM krsnil k
            JOIN mahasiswa m ON k.NPM = m.NPM
            JOIN jadwal j ON k.id_jadwal = j.id_jadwal
            JOIN matakuliah mk ON j.KodeMK = mk.KodeMK
            LEFT JOIN dosen d ON m.NIDN_Wali = d.NIDN
            WHERE k.NPM = ? AND k.status_verifikasi = 'Disetujui'
        `, [npm]);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCetakKHS = async (req, res) => {
    const { npm } = req.query;
    try {
        const [rows] = await db.query(`
            SELECT v.*, m.Nama, m.Prodi 
            FROM v_khs v
            JOIN mahasiswa m ON v.NPM = m.NPM
            WHERE v.NPM = ?
        `, [npm]);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const inputMahasiswa = async (req, res) => {
    const { NPM, Nama, JenisKelamin, TglLahir, Prodi, NIDN_Wali, password } = req.body;
    const foto = req.file ? req.file.filename : 'default_mhs.jpg';
    
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const hashedPassword = await bcrypt.hash(password.toString().trim(), 10);

        const [userResult] = await connection.query(
            `INSERT INTO users (username, password, role) VALUES (?, ?, 'mahasiswa')`,
            [NPM, hashedPassword]
        );

        await connection.query(
            `INSERT INTO mahasiswa (NPM, Nama, JenisKelamin, TglLahir, Prodi, Foto, NIDN_Wali, id_user) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [NPM, Nama, JenisKelamin, TglLahir, Prodi, foto, NIDN_Wali, userResult.insertId]
        );  

        await connection.commit();
        res.json({ success: true, message: 'Mahasiswa berhasil ditambahkan' });
    } catch (error) {
        await connection.rollback();
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads/', req.file.filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};

const updateMahasiswa = async (req, res) => {
    const { npm } = req.params;
    const { Nama, JenisKelamin, TglLahir, Prodi, NIDN_Wali, password } = req.body;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [oldData] = await connection.query("SELECT Foto, id_user FROM mahasiswa WHERE NPM = ?", [npm]);
        if (oldData.length === 0) return res.status(404).json({ success: false, message: 'Mhs tidak ditemukan' });

        let foto = oldData[0].Foto;

        if (req.file) {
            foto = req.file.filename;
            if (oldData[0].Foto && oldData[0].Foto !== 'default_mhs.jpg') {
                const oldPath = path.join(__dirname, '../uploads/', oldData[0].Foto);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        await connection.query(
            `UPDATE mahasiswa SET Nama=?, JenisKelamin=?, TglLahir=?, Prodi=?, Foto=?, NIDN_Wali=? WHERE NPM=?`,
            [Nama, JenisKelamin, TglLahir, Prodi, foto, NIDN_Wali, npm]
        );

        if (password && password.toString().trim() !== "") {
            const hashedPassword = await bcrypt.hash(password.toString().trim(), 10);
            await connection.query(
                `UPDATE users SET password=? WHERE id_user=?`,
                [hashedPassword, oldData[0].id_user]
            );
        }

        await connection.commit();
        res.json({ success: true, message: 'Data mahasiswa berhasil diperbarui' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};

const getDosenList = async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT NIDN, Nama FROM dosen ORDER BY Nama ASC`);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMahasiswaList = async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM mahasiswa ORDER BY Nama ASC`);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteMahasiswa = async (req, res) => {
    const { npm } = req.params;
    try {
        const [mhs] = await db.query("SELECT Foto, id_user FROM mahasiswa WHERE NPM = ?", [npm]);
        if (mhs.length > 0) {
            if (mhs[0].Foto && mhs[0].Foto !== 'default_mhs.jpg') {
                const fotoPath = path.join(__dirname, '../uploads/', mhs[0].Foto);
                if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
            }
            await db.query(`DELETE FROM users WHERE id_user = ?`, [mhs[0].id_user]);
        }
        res.json({ success: true, message: "Berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const inputDosen = async (req, res) => {
    const { NIDN, Nama, Gelar, JenisKelamin, Alamat, NoHP, password } = req.body;
    const foto = req.file ? req.file.filename : 'default_dsn.jpg';
    const id_user = `DSN-${NIDN}`;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // 1. Simpan ke tabel users
        await db.query(`INSERT INTO users (id_user, username, password, role) VALUES (?, ?, ?, 'dosen')`, 
        [id_user, NIDN, hashedPassword]);

        // 2. Simpan ke tabel dosen
        await db.query(
            `INSERT INTO dosen (NIDN, Nama, Gelar, JenisKelamin, Alamat, NoHP, Foto, id_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [NIDN, Nama, Gelar, JenisKelamin, Alamat, NoHP, foto, id_user]
        );

        res.json({ success: true, message: "Dosen berhasil didaftarkan" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDosen = async (req, res) => {
    const { nidn } = req.params;
    // Pastikan Nama field ini sama dengan yang di data.append('Nama', ...) di React
    const { Nama, Gelar, JenisKelamin, Alamat, NoHP, password } = req.body;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Ambil data lama untuk mendapatkan Foto dan id_user asli
        const [oldData] = await connection.query("SELECT Foto, id_user FROM dosen WHERE NIDN = ?", [nidn]);
        if (oldData.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Dosen tidak ditemukan' });
        }

        let foto = oldData[0].Foto;

        // 2. Logika Update Foto
        if (req.file) {
            foto = req.file.filename;
            if (oldData[0].Foto && oldData[0].Foto !== 'default_dsn.jpg') {
                const oldPath = path.join(__dirname, '../uploads/', oldData[0].Foto);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        // 3. Update Tabel Dosen
        await connection.query(
            `UPDATE dosen SET Nama=?, Gelar=?, JenisKelamin=?, Alamat=?, NoHP=?, Foto=? WHERE NIDN=?`,
            [Nama, Gelar, JenisKelamin, Alamat, NoHP, foto, nidn]
        );

        // 4. Update Password di tabel users jika diisi
        if (password && password.toString().trim() !== "") {
            const hashedPassword = await bcrypt.hash(password.toString().trim(), 10);
            await connection.query(
                `UPDATE users SET password=? WHERE id_user=?`,
                [hashedPassword, oldData[0].id_user]
            );
        }

        await connection.commit();
        res.json({ success: true, message: "Data dosen berhasil diperbarui secara permanen" });
    } catch (error) {
        await connection.rollback();
        console.error("Update Dosen Error:", error);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};

const deleteDosen = async (req, res) => {
    const { nidn } = req.params;
    try {
        const [row] = await db.query("SELECT Foto, id_user FROM dosen WHERE NIDN = ?", [nidn]);
        if (row.length > 0) {
            if (row[0].Foto && row[0].Foto !== 'default_dsn.jpg') {
                const p = path.join(__dirname, '../uploads/', row[0].Foto);
                if (fs.existsSync(p)) fs.unlinkSync(p);
            }
            await db.query("DELETE FROM users WHERE id_user = ?", [row[0].id_user]);
        }
        res.json({ success: true, message: "Dosen dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCetakKRS,
    getCetakKHS,
    inputMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
    getDosenList,
    getMahasiswaList,
    inputDosen,
    updateDosen,
    deleteDosen
};