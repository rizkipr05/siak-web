const db = require('../config/db');

const getBimbinganList = async (req, res) => {
    const { nidn } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT 
                m.NPM,
                m.Nama,
                m.Prodi,
                m.NIDN_Wali,
                COUNT(k.id_krs) AS total_krs,
                SUM(CASE WHEN k.status_verifikasi = 'Disetujui' THEN 1 ELSE 0 END) AS disetujui,
                SUM(CASE WHEN k.status_verifikasi = 'Ditolak' THEN 1 ELSE 0 END) AS ditolak,
                SUM(CASE WHEN k.status_verifikasi IS NULL OR k.status_verifikasi = 'Menunggu' THEN 1 ELSE 0 END) AS menunggu
            FROM mahasiswa m
            LEFT JOIN krsnil k ON m.NPM = k.NPM
            WHERE m.NIDN_Wali = ?
            GROUP BY m.NPM, m.Nama, m.Prodi, m.NIDN_Wali
            ORDER BY m.Nama ASC
        `, [nidn]);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("[ERROR] getBimbinganList:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getKrsBimbingan = async (req, res) => {
    const { nidn } = req.params;
    const status = (req.query.status || 'menunggu').toString().toLowerCase();
    try {
        let statusFilter = '';
        if (status === 'menunggu') {
            statusFilter = `AND (k.status_verifikasi IS NULL OR k.status_verifikasi = 'Menunggu')`;
        } else if (status === 'disetujui') {
            statusFilter = `AND k.status_verifikasi = 'Disetujui'`;
        } else if (status === 'ditolak') {
            statusFilter = `AND k.status_verifikasi = 'Ditolak'`;
        }

        const [rows] = await db.query(`
            SELECT 
                m.NPM,
                m.Nama,
                m.Prodi,
                k.id_krs,
                k.id_jadwal,
                k.status_verifikasi,
                mk.KodeMK,
                mk.NamaMatkul,
                mk.SKS,
                j.Kelas,
                d.Nama AS NamaDosen
            FROM mahasiswa m
            JOIN krsnil k ON m.NPM = k.NPM
            JOIN jadwal j ON k.id_jadwal = j.id_jadwal
            JOIN matakuliah mk ON j.KodeMK = mk.KodeMK
            LEFT JOIN dosen d ON j.NIDN = d.NIDN
            WHERE m.NIDN_Wali = ?
            ${statusFilter}
            ORDER BY m.Nama ASC, mk.NamaMatkul ASC
        `, [nidn]);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("[ERROR] getKrsBimbingan:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateKrsApproval = async (req, res) => {
    const { npm, status, id_krs, id_jadwal } = req.body;
    if (!npm || !status) {
        return res.status(400).json({ success: false, message: 'NPM dan status wajib diisi' });
    }
    if (!['Disetujui', 'Ditolak'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Status tidak valid' });
    }

    try {
        const conditions = ['NPM = ?'];
        const params = [status, npm];

        if (id_krs) {
            conditions.push('id_krs = ?');
            params.push(id_krs);
        }
        if (id_jadwal) {
            conditions.push('id_jadwal = ?');
            params.push(id_jadwal);
        }

        const whereClause = conditions.join(' AND ');

        const [result] = await db.query(
            `UPDATE krsnil SET status_verifikasi = ? WHERE ${whereClause} AND (status_verifikasi IS NULL OR status_verifikasi = 'Menunggu')`,
            params
        );

        res.json({ success: true, affectedRows: result.affectedRows });
    } catch (error) {
        console.error("[ERROR] updateKrsApproval:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getBimbinganList, getKrsBimbingan, updateKrsApproval };
