const db = require('../config/db');

const getAllMatkul = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.KodeMK, m.NamaMatkul, m.SKS, m.Semester, 
                   j.id_jadwal, j.Kelas, d.Nama AS NamaDosen
            FROM matakuliah m
            JOIN jadwal j ON m.KodeMK = j.KodeMK
            LEFT JOIN dosen d ON j.NIDN = d.NIDN
            ORDER BY m.Semester ASC, m.NamaMatkul ASC`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const simpanKRS = async (req, res) => {
    const { npm, tahun_ajaran, semester_akademik, selected_jadwal_ids } = req.body;
    if (!npm || !selected_jadwal_ids || selected_jadwal_ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }
    try {
        const values = selected_jadwal_ids.map(id => [tahun_ajaran, semester_akademik, npm, id]);
        await db.query(
            `INSERT IGNORE INTO krsnil (TahunAjaran, SemesterAkademik, NPM, id_jadwal) VALUES ?`,
            [values]
        );
        res.json({ success: true, message: 'KRS Berhasil Disimpan!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyKRS = async (req, res) => {
    const { npm } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT 
                k.id_krs,
                k.id_jadwal,
                m.KodeMK, 
                m.NamaMatkul, 
                m.SKS, 
                m.Semester,
                j.Kelas,
                d.Nama AS NamaDosen
            FROM krsnil k
            JOIN jadwal j ON k.id_jadwal = j.id_jadwal
            JOIN matakuliah m ON j.KodeMK = m.KodeMK
            JOIN dosen d ON j.NIDN = d.NIDN
            WHERE k.NPM = ?`, [npm]);
        
        res.json(rows); 
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const hapusKRS = async (req, res) => {
    const { npm, id_jadwal } = req.params;
    try {
        await db.query(`DELETE FROM krsnil WHERE NPM = ? AND id_jadwal = ?`, [npm, id_jadwal]);
        res.json({ success: true, message: 'Matakuliah berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllMatkul, simpanKRS, getMyKRS, hapusKRS };