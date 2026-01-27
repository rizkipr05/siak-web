const db = require('../config/db');

const getPertemuanByJadwal = async (req, res) => {
    const { id_jadwal } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT 
                id_pertemuan, 
                pertemuan_ke, 
                topik, 
                tanggal, 
                jam_mulai, 
                jam_selesai 
            FROM pertemuan 
            WHERE id_jadwal = ? 
            ORDER BY pertemuan_ke DESC`, [id_jadwal]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMhsForAbsen = async (req, res) => {
    const { id_jadwal } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT m.NPM, m.Nama 
            FROM krsnil k 
            JOIN mahasiswa m ON k.NPM = m.NPM 
            WHERE k.id_jadwal = ? AND k.status_verifikasi = 'Disetujui'`, [id_jadwal]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const cekAbsensi = async (req, res) => {
    const { id_pertemuan } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT NPM, status_hadir 
            FROM absensi 
            WHERE id_pertemuan = ?`, [id_pertemuan]);

        const reverseMapping = {
            'Hadir': 'H',
            'Sakit': 'S',
            'Izin': 'I',
            'Alfa': 'A'
        };

        const mappedData = rows.map(row => ({
            NPM: row.NPM,
            status_hadir: reverseMapping[row.status_hadir] || row.status_hadir
        }));

        res.json({
            success: true,
            hasData: rows.length > 0,
            data: mappedData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const submitAbsensi = async (req, res) => {
    const { id_pertemuan, data_absensi } = req.body; 
    try {
        const entries = Object.entries(data_absensi);
        if (entries.length === 0) return res.status(400).json({ success: false, message: 'Data kosong' });

        const statusMapping = {
            'H': 'Hadir',
            'S': 'Sakit',
            'I': 'Izin',
            'A': 'Alfa'
        };

        const values = entries.map(([npm, status]) => [
            id_pertemuan, 
            npm, 
            statusMapping[status] || status 
        ]);
        
        await db.query(`
            INSERT INTO absensi (id_pertemuan, NPM, status_hadir) 
            VALUES ? 
            ON DUPLICATE KEY UPDATE status_hadir = VALUES(status_hadir)`, [values]);
            
        res.json({ success: true, message: 'Data absensi berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRekapAbsensi = async (req, res) => {
    const { id_jadwal, pertemuan } = req.query;
    try {
        const query = `
            SELECT 
                m.NPM, 
                m.Nama,
                SUM(CASE WHEN a.status_hadir = 'Hadir' THEN 1 ELSE 0 END) as Hadir,
                SUM(CASE WHEN a.status_hadir = 'Izin' THEN 1 ELSE 0 END) as Izin,
                SUM(CASE WHEN a.status_hadir = 'Sakit' THEN 1 ELSE 0 END) as Sakit,
                SUM(CASE WHEN a.status_hadir = 'Alfa' THEN 1 ELSE 0 END) as Alfa
            FROM krsnil k
            JOIN mahasiswa m ON k.NPM = m.NPM
            LEFT JOIN pertemuan p ON k.id_jadwal = p.id_jadwal
            LEFT JOIN absensi a ON p.id_pertemuan = a.id_pertemuan AND m.NPM = a.NPM
            WHERE k.id_jadwal = ?
            ${pertemuan && pertemuan !== 'all' ? 'AND p.pertemuan_ke = ?' : ''}
            GROUP BY m.NPM, m.Nama
            ORDER BY m.Nama ASC
        `;

        const params = pertemuan && pertemuan !== 'all' ? [id_jadwal, pertemuan] : [id_jadwal];
        const [rows] = await db.query(query, params);
        
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error Rekap:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getPertemuanByJadwal, getMhsForAbsen, submitAbsensi, cekAbsensi, getRekapAbsensi };