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
                p.NIP,
                p.Nama,
                p.Jabatan,
                p.JenisKelamin
            FROM users u
            JOIN pegawai p ON u.id_user = p.id_user
            WHERE u.id_user = ?
            LIMIT 1
        `, [id_user]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Profil pegawai tidak ditemukan' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('[ERROR] getPegawaiProfile:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { id_user } = req.user || {};
    if (!id_user) {
        return res.status(401).json({ success: false, message: 'User tidak valid' });
    }
    const { NIP, Nama, Jabatan, JenisKelamin } = req.body;
    try {
        await db.query(
            `UPDATE pegawai SET NIP = COALESCE(?, NIP), Nama = COALESCE(?, Nama), Jabatan = COALESCE(?, Jabatan), JenisKelamin = COALESCE(?, JenisKelamin) WHERE id_user = ?`,
            [NIP || null, Nama || null, Jabatan || null, JenisKelamin || null, id_user]
        );
        res.json({ success: true, message: 'Profil pegawai diperbarui' });
    } catch (error) {
        console.error('[ERROR] updatePegawaiProfile:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getProfile, updateProfile };
