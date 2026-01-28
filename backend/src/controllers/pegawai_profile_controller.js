const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const DEFAULT_PEGAWAI_FOTO = 'default_pgw.jpg';

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
                p.JenisKelamin,
                p.Foto
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
        let newFoto = null;
        if (req.file) {
            newFoto = req.file.filename;
            const [rows] = await db.query(`SELECT Foto FROM pegawai WHERE id_user = ? LIMIT 1`, [id_user]);
            const oldFoto = rows[0]?.Foto;
            if (oldFoto && oldFoto !== DEFAULT_PEGAWAI_FOTO) {
                const oldPath = path.join(__dirname, '../uploads/', oldFoto);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        await db.query(
            `UPDATE pegawai 
             SET NIP = COALESCE(?, NIP), 
                 Nama = COALESCE(?, Nama), 
                 Jabatan = COALESCE(?, Jabatan), 
                 JenisKelamin = COALESCE(?, JenisKelamin),
                 Foto = COALESCE(?, Foto)
             WHERE id_user = ?`,
            [NIP || null, Nama || null, Jabatan || null, JenisKelamin || null, newFoto, id_user]
        );
        res.json({ success: true, message: 'Profil pegawai diperbarui' });
    } catch (error) {
        console.error('[ERROR] updatePegawaiProfile:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getProfile, updateProfile };
