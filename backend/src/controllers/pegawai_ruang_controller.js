const db = require('../config/db');

const ensureRuangTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS ruang_kelas (
            kode_ruang VARCHAR(20) PRIMARY KEY,
            nama_ruang VARCHAR(100) NOT NULL,
            kapasitas INT DEFAULT NULL
        )
    `);
};

const getRuangList = async (req, res) => {
    try {
        await ensureRuangTable();
        const [rows] = await db.query(`SELECT kode_ruang, nama_ruang, kapasitas FROM ruang_kelas ORDER BY kode_ruang ASC`);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[ERROR] getRuangList:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const createRuang = async (req, res) => {
    const { kode_ruang, nama_ruang, kapasitas } = req.body;
    if (!kode_ruang || !nama_ruang) {
        return res.status(400).json({ success: false, message: 'kode_ruang dan nama_ruang wajib diisi' });
    }
    try {
        await ensureRuangTable();
        await db.query(
            `INSERT INTO ruang_kelas (kode_ruang, nama_ruang, kapasitas) VALUES (?, ?, ?)`,
            [kode_ruang, nama_ruang, kapasitas || null]
        );
        res.json({ success: true, message: 'Ruang kelas berhasil ditambahkan' });
    } catch (error) {
        console.error('[ERROR] createRuang:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateRuang = async (req, res) => {
    const { kode } = req.params;
    const { nama_ruang, kapasitas } = req.body;
    try {
        await ensureRuangTable();
        await db.query(
            `UPDATE ruang_kelas SET nama_ruang = ?, kapasitas = ? WHERE kode_ruang = ?`,
            [nama_ruang, kapasitas || null, kode]
        );
        res.json({ success: true, message: 'Ruang kelas berhasil diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateRuang:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteRuang = async (req, res) => {
    const { kode } = req.params;
    try {
        await ensureRuangTable();
        await db.query(`DELETE FROM ruang_kelas WHERE kode_ruang = ?`, [kode]);
        res.json({ success: true, message: 'Ruang kelas berhasil dihapus' });
    } catch (error) {
        console.error('[ERROR] deleteRuang:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getRuangList, createRuang, updateRuang, deleteRuang };
