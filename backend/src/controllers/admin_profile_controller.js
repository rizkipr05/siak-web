const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const DEFAULT_ADMIN_FOTO = 'default_admin.jpg';

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
                a.email,
                a.Foto
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
        let newFoto = null;
        if (req.file) {
            newFoto = req.file.filename;
            const [rows] = await db.query(`SELECT Foto FROM admin WHERE id_user = ? LIMIT 1`, [id_user]);
            const oldFoto = rows[0]?.Foto;
            if (oldFoto && oldFoto !== DEFAULT_ADMIN_FOTO) {
                const oldPath = path.join(__dirname, '../uploads/', oldFoto);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        await db.query(
            `UPDATE admin 
             SET nama_admin = COALESCE(?, nama_admin), 
                 email = COALESCE(?, email),
                 Foto = COALESCE(?, Foto)
             WHERE id_user = ?`,
            [nama_admin || null, email || null, newFoto, id_user]
        );
        res.json({ success: true, message: 'Profil admin diperbarui' });
    } catch (error) {
        console.error('[ERROR] updateAdminProfile:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getProfile, updateProfile };
