const db = require('../config/db');

const getJadwalByDsn = async (req, res) => {
    const { nidn } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT 
                j.id_jadwal, 
                m.NamaMatkul, 
                j.Kelas, 
                m.KodeMK
            FROM jadwal j 
            INNER JOIN matakuliah m ON j.KodeMK = m.KodeMK 
            WHERE j.NIDN = ?`, [nidn]);
        res.json(rows);
    } catch (error) {
        console.error("[ERROR] getJadwalByDsn:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPertemuanByJadwal = async (req, res) => {
    const { id_jadwal } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT 
                id_pertemuan, 
                id_jadwal, 
                pertemuan_ke, 
                hari, 
                tanggal, 
                jam_mulai, 
                jam_selesai, 
                topik, 
                deskripsi 
            FROM pertemuan 
            WHERE id_jadwal = ? 
            ORDER BY pertemuan_ke DESC`, [id_jadwal]);
        
    
        res.json(rows);
    } catch (error) {
        console.error("[ERROR] getPertemuanByJadwal:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const createPertemuan = async (req, res) => {
    const { id_jadwal, pertemuan_ke, tanggal, jam_mulai, jam_selesai, topik, deskripsi } = req.body;

    try {
        const [lastRow] = await db.query(`
            SELECT id_pertemuan 
            FROM pertemuan 
            WHERE id_pertemuan LIKE 'PM%' 
            ORDER BY CAST(SUBSTRING(id_pertemuan, 3) AS UNSIGNED) DESC 
            LIMIT 1
        `);

        const lastId = lastRow[0]?.id_pertemuan || 'PM000';
        const lastNum = parseInt(lastId.slice(2), 10) || 0;
        const newId = `PM${String(lastNum + 1).padStart(3, '0')}`;

        const [exist] = await db.query(
            `SELECT id_pertemuan FROM pertemuan WHERE id_jadwal = ? AND pertemuan_ke = ?`,
            [id_jadwal, pertemuan_ke]
        );

        if (exist.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Pertemuan ke-${pertemuan_ke} untuk mata kuliah ini sudah terdaftar!` 
            });
        }

    
        await db.query(
            `INSERT INTO pertemuan (id_pertemuan, id_jadwal, pertemuan_ke, tanggal, jam_mulai, jam_selesai, topik, deskripsi) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [newId, id_jadwal, pertemuan_ke, tanggal, jam_mulai, jam_selesai, topik, deskripsi]
        );

        res.json({ success: true, message: 'Pertemuan berhasil disimpan' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getJadwalAktif = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                j.id_jadwal, 
                m.NamaMatkul, 
                j.Kelas, 
                m.KodeMK,
                d.Nama AS NamaDosen
            FROM jadwal j 
            INNER JOIN matakuliah m ON j.KodeMK = m.KodeMK 
            INNER JOIN dosen d ON j.NIDN = d.NIDN
            ORDER BY m.NamaMatkul ASC`);
        
    
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("[ERROR] getJadwalAktif:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDashboardByDsn = async (req, res) => {
    const { nidn } = req.params;
    try {
        const [jadwalRows] = await db.query(`
            SELECT 
                j.id_jadwal,
                j.Kelas,
                NULL AS Hari,
                NULL AS Jam,
                m.KodeMK,
                m.NamaMatkul,
                m.SKS,
                COUNT(DISTINCT k.NPM) AS total_mhs
            FROM jadwal j
            JOIN matakuliah m ON j.KodeMK = m.KodeMK
            LEFT JOIN krsnil k ON k.id_jadwal = j.id_jadwal AND k.status_verifikasi = 'Disetujui'
            WHERE j.NIDN = ?
            GROUP BY j.id_jadwal, j.Kelas, m.KodeMK, m.NamaMatkul, m.SKS
            ORDER BY m.NamaMatkul ASC
        `, [nidn]);

        const [sksRows] = await db.query(`
            SELECT COALESCE(SUM(m.SKS), 0) AS total_sks
            FROM jadwal j
            JOIN matakuliah m ON j.KodeMK = m.KodeMK
            WHERE j.NIDN = ?
        `, [nidn]);

        const [mhsRows] = await db.query(`
            SELECT COUNT(DISTINCT k.NPM) AS total_mhs
            FROM krsnil k
            JOIN jadwal j ON k.id_jadwal = j.id_jadwal
            WHERE j.NIDN = ? AND k.status_verifikasi = 'Disetujui'
        `, [nidn]);

        res.json({
            success: true,
            data: {
                totalSKS: sksRows[0]?.total_sks || 0,
                totalMahasiswa: mhsRows[0]?.total_mhs || 0,
                jadwal: jadwalRows
            }
        });
    } catch (error) {
        console.error("[ERROR] getDashboardByDsn:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { 
    getJadwalByDsn, 
    getPertemuanByJadwal, 
    createPertemuan, 
    getJadwalAktif,
    getDashboardByDsn
};
