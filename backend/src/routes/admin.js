const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin_controller");
const adminProfileController = require("../controllers/admin_profile_controller");
const adminMatkulController = require("../controllers/admin_matkul_controller");
const staffController = require("../controllers/staff_controller");
const absensiController = require("../controllers/absensi_controller");
const pertemuanController = require("../controllers/pertemuan_controller");
const { verifyRole } = require("../middleware/role");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error('Hanya diperbolehkan mengunggah gambar (jpg/png/webp)!'));
        }
    }
});

router.get("/summary", verifyRole('admin'), adminController.getSummary);
router.get("/health", verifyRole('admin'), adminController.getHealth);
router.get("/profile", verifyRole('admin'), adminProfileController.getProfile);
router.put("/profile", verifyRole('admin'), upload.single('foto'), adminProfileController.updateProfile);

router.get("/users", verifyRole('admin'), adminController.listUsers);
router.post("/users", verifyRole('admin'), adminController.createUser);
router.put("/users/:id_user", verifyRole('admin'), adminController.updateUser);
router.delete("/users/:id_user", verifyRole('admin'), adminController.deleteUser);
router.put("/users/role", verifyRole('admin'), adminController.updateUserRole);

router.get("/academic-periods", verifyRole('admin'), adminController.listAcademicPeriods);
router.post("/academic-periods", verifyRole('admin'), adminController.createAcademicPeriod);
router.put("/academic-periods/:id/activate", verifyRole('admin'), adminController.setActiveAcademicPeriod);
router.put("/academic-periods/:id", verifyRole('admin'), adminController.updateAcademicPeriod);
router.delete("/academic-periods/:id", verifyRole('admin'), adminController.deleteAcademicPeriod);

router.get("/krs", verifyRole('admin'), adminController.listKRS);
router.put("/krs/status", verifyRole('admin'), adminController.updateKRSStatus);
router.delete("/krs/:id_krs", verifyRole('admin'), adminController.deleteKRS);

router.get("/khs", verifyRole('admin'), adminController.listKHS);

router.get("/nilai", verifyRole('admin'), adminController.listNilai);
router.put("/nilai", verifyRole('admin'), adminController.updateNilai);
router.delete("/nilai/:id_krs", verifyRole('admin'), adminController.deleteNilai);

router.get("/absensi", verifyRole('admin'), adminController.listAbsensi);
router.put("/absensi/:id_absen", verifyRole('admin'), adminController.updateAbsensiStatus);
router.delete("/absensi/:id_absen", verifyRole('admin'), adminController.deleteAbsensi);

// Reports (admin only)
router.get("/reports/krs", verifyRole('admin'), staffController.getCetakKRS);
router.get("/reports/khs", verifyRole('admin'), staffController.getCetakKHS);
router.get("/reports/absensi", verifyRole('admin'), absensiController.getRekapAbsensi);
router.get("/reports/jadwal-aktif", verifyRole('admin'), pertemuanController.getJadwalAktif);

// Master Data (admin only)
router.get("/master/mahasiswa", verifyRole('admin'), staffController.getMahasiswaList);
router.post("/master/mahasiswa", verifyRole('admin'), upload.single('foto'), staffController.inputMahasiswa);
router.put("/master/mahasiswa/:npm", verifyRole('admin'), upload.single('foto'), staffController.updateMahasiswa);
router.delete("/master/mahasiswa/:npm", verifyRole('admin'), staffController.deleteMahasiswa);

router.get("/master/dosen", verifyRole('admin'), staffController.getDosenList);
router.post("/master/dosen", verifyRole('admin'), upload.single('foto'), staffController.inputDosen);
router.put("/master/dosen/:nidn", verifyRole('admin'), upload.single('foto'), staffController.updateDosen);
router.delete("/master/dosen/:nidn", verifyRole('admin'), staffController.deleteDosen);

router.get("/master/matakuliah", verifyRole('admin'), adminMatkulController.getMatkulList);
router.post("/master/matakuliah", verifyRole('admin'), adminMatkulController.createMatkul);
router.put("/master/matakuliah/:kode", verifyRole('admin'), adminMatkulController.updateMatkul);
router.delete("/master/matakuliah/:kode", verifyRole('admin'), adminMatkulController.deleteMatkul);

module.exports = router;
