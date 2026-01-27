const db = require('../config/db');

const getProfile = async (req, res) => {
    const { id_user } = req.user || {};
    if (!id_user) {
        return res.status(401).json({ success: false, message: 'User tidak valid' });
    }
    try {
        const [rows] = await db.query(`
            SELECT 
                u.username,
                u.role,
                d.NIDN,
                d.Nama,
                d.Gelar,
                d.JenisKelamin,
                d.Alamat,
                d.NoHP,
                d.Foto
            FROM users u
            JOIN dosen d ON u.id_user = d.id_user
            WHERE u.id_user = ?
            LIMIT 1
        `, [id_user]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Profil dosen tidak ditemukan' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('[ERROR] getDosenProfile:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { id_user } = req.user || {};
    if (!id_user) {
        return res.status(401).json({ success: false, message: 'User tidak valid' });
    }
    const { NIDN, Nama, Gelar, JenisKelamin, Alamat, NoHP } = req.body;
    try {
        await db.query(
            `UPDATE dosen SET NIDN = COALESCE(?, NIDN), Nama = COALESCE(?, Nama), Gelar = COALESCE(?, Gelar),
             JenisKelamin = COALESCE(?, JenisKelamin), Alamat = COALESCE(?, Alamat), NoHP = COALESCE(?, NoHP)
             WHERE id_user = ?`,
            [NIDN || null, Nama || null, Gelar || null, JenisKelamin || null, Alamat || null, NoHP || null, id_user]
        );
        res.json({ success: true, message: 'Profil dosen diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateDosenProfile:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getProfile, updateProfile };
