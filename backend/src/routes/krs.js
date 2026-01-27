const express = require("express");
const router = express.Router();
const db = require("../config/db");
const matkulController = require("../controllers/matkul_controller");
const { verifyRole } = require("../middleware/role");

router.get("/:npm", verifyRole('mahasiswa'), async (req, res) => {
    const { npm } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT id_jadwal FROM krsnil WHERE NPM = ?", 
            [npm]
        );
        const selectedIds = rows.map(row => String(row.id_jadwal)); 
        res.json({ success: true, data: selectedIds });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/my-krs/:npm", verifyRole('mahasiswa'), matkulController.getMyKRS);

router.post("/simpan", verifyRole('mahasiswa'), async (req, res) => {
    const { npm, jadwal_ids, tahunAjaran, semesterAkademik } = req.body;
    try {
        const cleanIds = jadwal_ids.filter(id => id !== null && id !== undefined);
        if (cleanIds.length > 0) {
            for (let id of cleanIds) {
                const [existing] = await db.query(
                    "SELECT id_krs FROM krsnil WHERE NPM = ? AND id_jadwal = ?",
                    [npm, id]
                );
                if (existing.length === 0) {
                    await db.query(
                        "INSERT INTO krsnil (TahunAjaran, SemesterAkademik, NPM, id_jadwal) VALUES (?, ?, ?, ?)",
                        [tahunAjaran, semesterAkademik, npm, id]
                    );
                }
            }
        }
        res.json({ success: true, message: "KRS Berhasil Diperbarui" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete("/hapus/:npm/:id_jadwal", verifyRole('mahasiswa'), async (req, res) => {
    const { npm, id_jadwal } = req.params;
    try {
        await db.query(
            "DELETE FROM krsnil WHERE NPM = ? AND id_jadwal = ?",
            [npm, id_jadwal]
        );
        res.json({ success: true, message: "Mata kuliah berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;