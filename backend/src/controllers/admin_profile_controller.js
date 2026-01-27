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
                a.nama_admin,
                a.email
            FROM users u
            JOIN admin a ON u.id_user = a.id_user
            WHERE u.id_user = ?
            LIMIT 1
        `, [id_user]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Profil admin tidak ditemukan' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('[ERROR] getAdminProfile:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { id_user } = req.user || {};
    if (!id_user) {
        return res.status(401).json({ success: false, message: 'User tidak valid' });
    }
    const { nama_admin, email } = req.body;
    try {
        await db.query(
            `UPDATE admin SET nama_admin = COALESCE(?, nama_admin), email = COALESCE(?, email) WHERE id_user = ?`,
            [nama_admin || null, email || null, id_user]
        );
        res.json({ success: true, message: 'Profil admin diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateAdminProfile:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getProfile, updateProfile };
