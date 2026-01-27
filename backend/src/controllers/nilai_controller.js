const db = require("../config/db");

const getPesertaNilai = async (req, res) => {
    const { id_jadwal } = req.params;
    
    console.log("=== API NILAI DIPANGGIL ===");
    console.log("Mencari peserta untuk ID Jadwal:", id_jadwal);

    try {
        const [rows] = await db.query(`
            SELECT 
                k.id_krs, 
                k.NPM, 
                m.Nama AS NamaMahasiswa, 
                k.nsikap, 
                k.ntugas, 
                k.nuts, 
                k.nuas
            FROM krsnil k
            JOIN mahasiswa m ON k.NPM = m.NPM
            WHERE k.id_jadwal = ? AND k.status_verifikasi = 'Disetujui'
            ORDER BY k.NPM ASC
        `, [id_jadwal]);

        console.log(`Ditemukan ${rows.length} mahasiswa.`);
        res.json(rows);
    } catch (error) {
        console.error("DATABASE ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateNilaiMahasiswa = async (req, res) => {
    const { id_jadwal, payload } = req.body;

    if (!payload || !Array.isArray(payload)) {
        return res.status(400).json({ success: false, message: "Payload tidak valid" });
    }

    try {
        for (const data of payload) {
            await db.query(`
                UPDATE krsnil 
                SET nsikap = ?, ntugas = ?, nuts = ?, nuas = ? 
                WHERE NPM = ? AND id_jadwal = ?
            `, [
                data.nsikap || 0,
                data.ntugas || 0,
                data.nuts || 0,
                data.nuas || 0,
                data.NPM,
                id_jadwal
            ]);
        }
        res.json({ success: true, message: "Nilai berhasil diperbarui" });
    } catch (error) {
        console.error("UPDATE ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getPesertaNilai,
    updateNilaiMahasiswa
};