const db = require('../config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const generateNextId = async (connection, { table, column, prefix, pad }) => {
    const like = `${prefix}%`;
    const startIndex = prefix.length + 1;
    const [rows] = await connection.query(
        `SELECT ${column} AS id
         FROM ${table}
         WHERE ${column} LIKE ?
         ORDER BY CAST(SUBSTRING(${column}, ?) AS UNSIGNED) DESC
         LIMIT 1`,
        [like, startIndex]
    );
    const lastId = rows[0]?.id || `${prefix}${'0'.repeat(pad)}`;
    const suffix = String(lastId).slice(prefix.length);
    const lastNum = /^\d+$/.test(suffix) ? parseInt(suffix, 10) : 0;
    return `${prefix}${String(lastNum + 1).padStart(pad, '0')}`;
};

const ensureAcademicPeriodsTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS academic_periods (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tahun_ajaran VARCHAR(9) NOT NULL,
            semester ENUM('Ganjil', 'Genap') NOT NULL,
            aktif TINYINT(1) NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

const getSummary = async (req, res) => {
    try {
        const [[u]] = await db.query(`SELECT COUNT(*) AS total FROM users`);
        const [[m]] = await db.query(`SELECT COUNT(*) AS total FROM mahasiswa`);
        const [[d]] = await db.query(`SELECT COUNT(*) AS total FROM dosen`);
        const [[p]] = await db.query(`SELECT COUNT(*) AS total FROM pegawai`);
        const [[a]] = await db.query(`SELECT COUNT(*) AS total FROM admin`);
        const [[k]] = await db.query(`SELECT COUNT(*) AS total FROM krsnil WHERE status_verifikasi IS NULL OR status_verifikasi = 'Menunggu'`);
        const [[abs]] = await db.query(`SELECT COUNT(*) AS total FROM absensi`);
        const [[per]] = await db.query(`SELECT COUNT(*) AS total FROM pertemuan`);

        res.json({
            success: true,
            data: {
                totalUsers: u.total,
                totalMahasiswa: m.total,
                totalDosen: d.total,
                totalPegawai: p.total,
                totalAdmin: a.total,
                krsPending: k.total,
                totalAbsensi: abs.total,
                totalPertemuan: per.total
            }
        });
    } catch (error) {
        console.error('[ERROR] getSummary:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getHealth = async (req, res) => {
    try {
        await db.query(`SELECT 1`);
        res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const listUsers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                u.id_user,
                u.username,
                u.role,
                COALESCE(m.Nama, d.Nama, p.Nama, a.nama_admin) AS nama
            FROM users u
            LEFT JOIN mahasiswa m ON u.id_user = m.id_user
            LEFT JOIN dosen d ON u.id_user = d.id_user
            LEFT JOIN pegawai p ON u.id_user = p.id_user
            LEFT JOIN admin a ON u.id_user = a.id_user
            ORDER BY u.id_user DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[ERROR] listUsers:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const createUser = async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ success: false, message: 'username, password, dan role wajib diisi' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const hashedPassword = await bcrypt.hash(password.toString().trim(), 10);

        const rolePrefixMap = {
            admin: 'ADM',
            pegawai: 'PGW',
            mahasiswa: 'MHS',
            dosen: 'DSN'
        };
        const prefix = rolePrefixMap[role] || 'USR';
        const idUser = await generateNextId(connection, { table: 'users', column: 'id_user', prefix, pad: 3 });

        await connection.query(
            `INSERT INTO users (id_user, username, password, role) VALUES (?, ?, ?, ?)`,
            [idUser, username, hashedPassword, role]
        );

        if (role === 'admin') {
            const nama_admin = req.body.nama || 'Admin';
            const email = req.body.email || null;
            const idAdmin = await generateNextId(connection, { table: 'admin', column: 'id_admin', prefix: 'A', pad: 2 });
            const foto = req.body.foto || 'default_admin.jpg';
            await connection.query(
                `INSERT INTO admin (id_admin, nama_admin, email, Foto, id_user) VALUES (?, ?, ?, ?, ?)`,
                [idAdmin, nama_admin, email, foto, idUser]
            );
        } else if (role === 'pegawai') {
            const nip = req.body.nip || username;
            const nama = req.body.nama || 'Pegawai';
            const jenis_kelamin = req.body.jenis_kelamin || 'L';
            await connection.query(
                `INSERT INTO pegawai (NIP, Nama, Jabatan, JenisKelamin, id_user) VALUES (?, ?, ?, ?, ?)`,
                [nip, nama, 'Staf', jenis_kelamin, idUser]
            );
        } else if (role === 'mahasiswa') {
            const npm = req.body.npm || username;
            const nama = req.body.nama || 'Mahasiswa';
            const jenis_kelamin = req.body.jenis_kelamin || 'L';
            const tgl_lahir = req.body.tgl_lahir || null;
            const prodi = req.body.prodi || null;
            const nidn_wali = req.body.nidn_wali || null;
            await connection.query(
                `INSERT INTO mahasiswa (NPM, Nama, JenisKelamin, TglLahir, Prodi, Foto, NIDN_Wali, id_user) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [npm, nama, jenis_kelamin, tgl_lahir, prodi, 'default_mhs.jpg', nidn_wali, idUser]
            );
        } else if (role === 'dosen') {
            const nidn = req.body.nidn || username;
            const nama = req.body.nama || 'Dosen';
            const gelar = req.body.gelar || null;
            const jenis_kelamin = req.body.jenis_kelamin || 'L';
            const alamat = req.body.alamat || null;
            const nohp = req.body.nohp || null;
            await connection.query(
                `INSERT INTO dosen (NIDN, Nama, Gelar, JenisKelamin, Alamat, NoHP, Foto, id_user) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [nidn, nama, gelar, jenis_kelamin, alamat, nohp, 'default_dsn.jpg', idUser]
            );
        }

        await connection.commit();
        res.json({ success: true, message: 'User berhasil dibuat', data: { id_user: idUser } });
    } catch (error) {
        await connection.rollback();
        console.error('[ERROR] createUser:', error.message);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};

const updateUser = async (req, res) => {
    const { id_user } = req.params;
    const { username, password } = req.body;
    try {
        const [rows] = await db.query(`SELECT role FROM users WHERE id_user = ? LIMIT 1`, [id_user]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        const role = rows[0].role;

        if (username) {
            await db.query(`UPDATE users SET username = ? WHERE id_user = ?`, [username, id_user]);
        }
        if (password && password.toString().trim() !== '') {
            const hashedPassword = await bcrypt.hash(password.toString().trim(), 10);
            await db.query(`UPDATE users SET password = ? WHERE id_user = ?`, [hashedPassword, id_user]);
        }

        if (role === 'admin') {
            const nama_admin = req.body.nama_admin || req.body.nama;
            const email = req.body.email;
            if (nama_admin || email) {
                await db.query(
                    `UPDATE admin SET nama_admin = COALESCE(?, nama_admin), email = COALESCE(?, email) WHERE id_user = ?`,
                    [nama_admin || null, email || null, id_user]
                );
            }
        } else if (role === 'pegawai') {
            const nama = req.body.nama;
            const nip = req.body.nip;
            const jenis_kelamin = req.body.jenis_kelamin;
            await db.query(
                `UPDATE pegawai SET Nama = COALESCE(?, Nama), NIP = COALESCE(?, NIP), JenisKelamin = COALESCE(?, JenisKelamin) WHERE id_user = ?`,
                [nama || null, nip || null, jenis_kelamin || null, id_user]
            );
        } else if (role === 'mahasiswa') {
            const nama = req.body.nama;
            const npm = req.body.npm;
            const jenis_kelamin = req.body.jenis_kelamin;
            const tgl_lahir = req.body.tgl_lahir;
            const prodi = req.body.prodi;
            await db.query(
                `UPDATE mahasiswa SET Nama = COALESCE(?, Nama), NPM = COALESCE(?, NPM), JenisKelamin = COALESCE(?, JenisKelamin), TglLahir = COALESCE(?, TglLahir), Prodi = COALESCE(?, Prodi) WHERE id_user = ?`,
                [nama || null, npm || null, jenis_kelamin || null, tgl_lahir || null, prodi || null, id_user]
            );
        } else if (role === 'dosen') {
            const nama = req.body.nama;
            const nidn = req.body.nidn;
            const gelar = req.body.gelar;
            await db.query(
                `UPDATE dosen SET Nama = COALESCE(?, Nama), NIDN = COALESCE(?, NIDN), Gelar = COALESCE(?, Gelar) WHERE id_user = ?`,
                [nama || null, nidn || null, gelar || null, id_user]
            );
        }

        res.json({ success: true, message: 'User berhasil diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateUser:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id_user } = req.params;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [rows] = await connection.query(`SELECT role FROM users WHERE id_user = ? LIMIT 1`, [id_user]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        const role = rows[0].role;

        if (role === 'mahasiswa') {
            const [m] = await connection.query(`SELECT Foto FROM mahasiswa WHERE id_user = ?`, [id_user]);
            await connection.query(`DELETE FROM mahasiswa WHERE id_user = ?`, [id_user]);
            if (m[0]?.Foto && m[0].Foto !== 'default_mhs.jpg') {
                const filePath = path.join(__dirname, '../uploads/', m[0].Foto);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        } else if (role === 'dosen') {
            const [d] = await connection.query(`SELECT Foto FROM dosen WHERE id_user = ?`, [id_user]);
            await connection.query(`DELETE FROM dosen WHERE id_user = ?`, [id_user]);
            if (d[0]?.Foto && d[0].Foto !== 'default_dsn.jpg') {
                const filePath = path.join(__dirname, '../uploads/', d[0].Foto);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        } else if (role === 'pegawai') {
            await connection.query(`DELETE FROM pegawai WHERE id_user = ?`, [id_user]);
        } else if (role === 'admin') {
            await connection.query(`DELETE FROM admin WHERE id_user = ?`, [id_user]);
        }

        await connection.query(`DELETE FROM users WHERE id_user = ?`, [id_user]);
        await connection.commit();
        res.json({ success: true, message: 'User berhasil dihapus' });
    } catch (error) {
        await connection.rollback();
        console.error('[ERROR] deleteUser:', error.message);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};

const updateUserRole = async (req, res) => {
    const { id_user, role } = req.body;
    if (!id_user || !role) {
        return res.status(400).json({ success: false, message: 'id_user dan role wajib diisi' });
    }
    if (!['admin', 'pegawai'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Perubahan role hanya untuk admin/pegawai' });
    }
    try {
        await db.query(`UPDATE users SET role = ? WHERE id_user = ?`, [role, id_user]);
        res.json({ success: true, message: 'Hak akses diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateUserRole:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listAcademicPeriods = async (req, res) => {
    try {
        await ensureAcademicPeriodsTable();
        const [rows] = await db.query(`SELECT * FROM academic_periods ORDER BY id DESC`);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[ERROR] listAcademicPeriods:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const createAcademicPeriod = async (req, res) => {
    const { tahun_ajaran, semester } = req.body;
    if (!tahun_ajaran || !semester) {
        return res.status(400).json({ success: false, message: 'tahun_ajaran dan semester wajib diisi' });
    }
    try {
        await ensureAcademicPeriodsTable();
        await db.query(`INSERT INTO academic_periods (tahun_ajaran, semester, aktif) VALUES (?, ?, 0)`, [tahun_ajaran, semester]);
        res.json({ success: true, message: 'Periode akademik ditambahkan' });
    } catch (error) {
        console.error('[ERROR] createAcademicPeriod:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const setActiveAcademicPeriod = async (req, res) => {
    const { id } = req.params;
    try {
        await ensureAcademicPeriodsTable();
        await db.query(`UPDATE academic_periods SET aktif = 0`);
        await db.query(`UPDATE academic_periods SET aktif = 1 WHERE id = ?`, [id]);
        res.json({ success: true, message: 'Periode aktif diperbarui' });
    } catch (error) {
        console.error('[ERROR] setActiveAcademicPeriod:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listKRS = async (req, res) => {
    const { npm, status } = req.query;
    const filters = [];
    const params = [];
    if (npm) {
        filters.push(`k.NPM = ?`);
        params.push(npm);
    }
    if (status) {
        filters.push(`k.status_verifikasi = ?`);
        params.push(status);
    }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    try {
        const [rows] = await db.query(`
            SELECT 
                k.id_krs, k.NPM, k.id_jadwal, k.status_verifikasi,
                m.Nama AS NamaMahasiswa, m.Prodi,
                mk.KodeMK, mk.NamaMatkul, mk.SKS,
                j.Kelas,
                d.Nama AS NamaDosen
            FROM krsnil k
            JOIN mahasiswa m ON k.NPM = m.NPM
            JOIN jadwal j ON k.id_jadwal = j.id_jadwal
            JOIN matakuliah mk ON j.KodeMK = mk.KodeMK
            LEFT JOIN dosen d ON j.NIDN = d.NIDN
            ${where}
            ORDER BY k.id_krs DESC
        `, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[ERROR] listKRS:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateKRSStatus = async (req, res) => {
    const { id_krs, status } = req.body;
    if (!id_krs || !status) {
        return res.status(400).json({ success: false, message: 'id_krs dan status wajib diisi' });
    }
    try {
        await db.query(`UPDATE krsnil SET status_verifikasi = ? WHERE id_krs = ?`, [status, id_krs]);
        res.json({ success: true, message: 'Status KRS diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateKRSStatus:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listKHS = async (req, res) => {
    const { npm } = req.query;
    if (!npm) {
        return res.status(400).json({ success: false, message: 'npm wajib diisi' });
    }
    try {
        const [rows] = await db.query(`
            SELECT 
                k.id_krs,
                k.nsikap, k.ntugas, k.nuts, k.nuas,
                v.SemesterAkademik, v.TahunAjaran, v.NamaMatkul, v.SKS, v.NA, v.Huruf, v.Bobot,
                m.Nama, m.Prodi, m.NPM
            FROM v_khs v
            JOIN mahasiswa m ON v.NPM = m.NPM
            JOIN krsnil k ON v.id_krs = k.id_krs
            WHERE v.NPM = ?
            ORDER BY v.id_krs DESC
        `, [npm]);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[ERROR] listKHS:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listNilai = async (req, res) => {
    const { npm, id_jadwal } = req.query;
    const filters = [];
    const params = [];
    if (npm) { filters.push(`k.NPM = ?`); params.push(npm); }
    if (id_jadwal) { filters.push(`k.id_jadwal = ?`); params.push(id_jadwal); }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    try {
        const [rows] = await db.query(`
            SELECT 
                k.id_krs, k.NPM, k.id_jadwal,
                k.nsikap, k.ntugas, k.nuts, k.nuas,
                m.Nama AS NamaMahasiswa,
                mk.KodeMK, mk.NamaMatkul,
                j.Kelas
            FROM krsnil k
            JOIN mahasiswa m ON k.NPM = m.NPM
            JOIN jadwal j ON k.id_jadwal = j.id_jadwal
            JOIN matakuliah mk ON j.KodeMK = mk.KodeMK
            ${where}
            ORDER BY k.id_krs DESC
        `, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[ERROR] listNilai:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateNilai = async (req, res) => {
    const { id_krs, nsikap, ntugas, nuts, nuas } = req.body;
    if (!id_krs) {
        return res.status(400).json({ success: false, message: 'id_krs wajib diisi' });
    }
    try {
        await db.query(`
            UPDATE krsnil 
            SET nsikap = ?, ntugas = ?, nuts = ?, nuas = ?
            WHERE id_krs = ?
        `, [nsikap || 0, ntugas || 0, nuts || 0, nuas || 0, id_krs]);
        res.json({ success: true, message: 'Nilai diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateNilai:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteNilai = async (req, res) => {
    const { id_krs } = req.params;
    if (!id_krs) {
        return res.status(400).json({ success: false, message: 'id_krs wajib diisi' });
    }
    try {
        await db.query(`DELETE FROM krsnil WHERE id_krs = ?`, [id_krs]);
        res.json({ success: true, message: 'Nilai dihapus' });
    } catch (error) {
        console.error('[ERROR] deleteNilai:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listAbsensi = async (req, res) => {
    const { npm, id_jadwal } = req.query;
    const filters = [];
    const params = [];
    if (npm) { filters.push(`a.NPM = ?`); params.push(npm); }
    if (id_jadwal) { filters.push(`p.id_jadwal = ?`); params.push(id_jadwal); }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    try {
        const [rows] = await db.query(`
            SELECT 
                a.id_absen, a.NPM, a.status_hadir,
                p.id_pertemuan, p.pertemuan_ke, p.tanggal,
                j.id_jadwal, j.Kelas,
                mk.KodeMK, mk.NamaMatkul,
                m.Nama AS NamaMahasiswa
            FROM absensi a
            JOIN pertemuan p ON a.id_pertemuan = p.id_pertemuan
            JOIN jadwal j ON p.id_jadwal = j.id_jadwal
            JOIN matakuliah mk ON j.KodeMK = mk.KodeMK
            JOIN mahasiswa m ON a.NPM = m.NPM
            ${where}
            ORDER BY a.id_absen DESC
        `, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[ERROR] listAbsensi:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateAbsensiStatus = async (req, res) => {
    const { id_absen } = req.params;
    const { status_hadir } = req.body;
    if (!id_absen || !status_hadir) {
        return res.status(400).json({ success: false, message: 'id_absen dan status_hadir wajib diisi' });
    }
    try {
        await db.query(`UPDATE absensi SET status_hadir = ? WHERE id_absen = ?`, [status_hadir, id_absen]);
        res.json({ success: true, message: 'Absensi diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateAbsensiStatus:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteAbsensi = async (req, res) => {
    const { id_absen } = req.params;
    if (!id_absen) {
        return res.status(400).json({ success: false, message: 'id_absen wajib diisi' });
    }
    try {
        await db.query(`DELETE FROM absensi WHERE id_absen = ?`, [id_absen]);
        res.json({ success: true, message: 'Absensi dihapus' });
    } catch (error) {
        console.error('[ERROR] deleteAbsensi:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateAcademicPeriod = async (req, res) => {
    const { id } = req.params;
    const { tahun_ajaran, semester } = req.body;
    if (!id || !tahun_ajaran || !semester) {
        return res.status(400).json({ success: false, message: 'id, tahun_ajaran, dan semester wajib diisi' });
    }
    try {
        await ensureAcademicPeriodsTable();
        await db.query(`UPDATE academic_periods SET tahun_ajaran = ?, semester = ? WHERE id = ?`, [tahun_ajaran, semester, id]);
        res.json({ success: true, message: 'Periode akademik diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateAcademicPeriod:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteAcademicPeriod = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: 'id wajib diisi' });
    }
    try {
        await ensureAcademicPeriodsTable();
        await db.query(`DELETE FROM academic_periods WHERE id = ?`, [id]);
        res.json({ success: true, message: 'Periode akademik dihapus' });
    } catch (error) {
        console.error('[ERROR] deleteAcademicPeriod:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteKRS = async (req, res) => {
    const { id_krs } = req.params;
    if (!id_krs) {
        return res.status(400).json({ success: false, message: 'id_krs wajib diisi' });
    }
    try {
        await db.query(`DELETE FROM krsnil WHERE id_krs = ?`, [id_krs]);
        res.json({ success: true, message: 'KRS dihapus' });
    } catch (error) {
        console.error('[ERROR] deleteKRS:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getSummary,
    getHealth,
    listUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserRole,
    listAcademicPeriods,
    createAcademicPeriod,
    setActiveAcademicPeriod,
    updateAcademicPeriod,
    deleteAcademicPeriod,
    listKRS,
    updateKRSStatus,
    deleteKRS,
    listKHS,
    listNilai,
    updateNilai,
    deleteNilai,
    listAbsensi,
    updateAbsensiStatus,
    deleteAbsensi
};
