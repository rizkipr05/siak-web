const db = require('../config/db');

const getMatkulList = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT KodeMK, NamaMatkul, SKS, Semester
            FROM matakuliah
            ORDER BY Semester ASC, NamaMatkul ASC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[ERROR] getMatkulList:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const createMatkul = async (req, res) => {
    const { KodeMK, NamaMatkul, SKS, Semester } = req.body;
    if (!KodeMK || !NamaMatkul || !SKS || !Semester) {
        return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }
    try {
        await db.query(
            `INSERT INTO matakuliah (KodeMK, NamaMatkul, SKS, Semester) VALUES (?, ?, ?, ?)`,
            [KodeMK, NamaMatkul, SKS, Semester]
        );
        res.json({ success: true, message: 'Mata kuliah berhasil ditambahkan' });
    } catch (error) {
        console.error('[ERROR] createMatkul:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateMatkul = async (req, res) => {
    const { kode } = req.params;
    const { NamaMatkul, SKS, Semester } = req.body;
    try {
        await db.query(
            `UPDATE matakuliah SET NamaMatkul = ?, SKS = ?, Semester = ? WHERE KodeMK = ?`,
            [NamaMatkul, SKS, Semester, kode]
        );
        res.json({ success: true, message: 'Mata kuliah berhasil diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateMatkul:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteMatkul = async (req, res) => {
    const { kode } = req.params;
    try {
        await db.query(`DELETE FROM matakuliah WHERE KodeMK = ?`, [kode]);
        res.json({ success: true, message: 'Mata kuliah berhasil dihapus' });
    } catch (error) {
        console.error('[ERROR] deleteMatkul:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getMatkulList, createMatkul, updateMatkul, deleteMatkul };
