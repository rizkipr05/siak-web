const db = require('../config/db');

const getJadwalList = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                j.id_jadwal,
                j.KodeMK,
                j.NIDN,
                j.Kelas,
                m.NamaMatkul,
                d.Nama AS NamaDosen
            FROM jadwal j
            JOIN matakuliah m ON j.KodeMK = m.KodeMK
            JOIN dosen d ON j.NIDN = d.NIDN
            ORDER BY j.id_jadwal DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[ERROR] getJadwalList:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const createJadwal = async (req, res) => {
    const { KodeMK, NIDN, Kelas } = req.body;
    if (!KodeMK || !NIDN || !Kelas) {
        return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }
    try {
        const [lastRow] = await db.query(`
            SELECT id_jadwal 
            FROM jadwal 
            WHERE id_jadwal LIKE 'JL%' 
            ORDER BY CAST(SUBSTRING(id_jadwal, 3) AS UNSIGNED) DESC 
            LIMIT 1
        `);
        const lastId = lastRow[0]?.id_jadwal || 'JL000';
        const lastNum = parseInt(lastId.slice(2), 10) || 0;
        const newId = `JL${String(lastNum + 1).padStart(3, '0')}`;

        await db.query(
            `INSERT INTO jadwal (id_jadwal, KodeMK, NIDN, Kelas) VALUES (?, ?, ?, ?)`,
            [newId, KodeMK, NIDN, Kelas]
        );
        res.json({ success: true, message: 'Jadwal berhasil ditambahkan' });
    } catch (error) {
        console.error('[ERROR] createJadwal:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateJadwal = async (req, res) => {
    const { id } = req.params;
    const { KodeMK, NIDN, Kelas } = req.body;
    try {
        await db.query(
            `UPDATE jadwal SET KodeMK = ?, NIDN = ?, Kelas = ? WHERE id_jadwal = ?`,
            [KodeMK, NIDN, Kelas, id]
        );
        res.json({ success: true, message: 'Jadwal berhasil diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateJadwal:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteJadwal = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`DELETE FROM jadwal WHERE id_jadwal = ?`, [id]);
        res.json({ success: true, message: 'Jadwal berhasil dihapus' });
    } catch (error) {
        console.error('[ERROR] deleteJadwal:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getJadwalList, createJadwal, updateJadwal, deleteJadwal };
