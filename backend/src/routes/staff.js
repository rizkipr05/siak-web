const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff_controller');
const multer = require('multer');
const path = require('path');
const pertemuanController = require('../controllers/pertemuan_controller');
const absensiController = require('../controllers/absensi_controller');
const pegawaiMatkulController = require('../controllers/pegawai_matkul_controller');
const pegawaiRuangController = require('../controllers/pegawai_ruang_controller');
const pegawaiJadwalController = require('../controllers/pegawai_jadwal_controller');
const pegawaiProfileController = require('../controllers/pegawai_profile_controller');
const { verifyRole } = require("../middleware/role");

// 1. Konfigurasi Penyimpanan File
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

router.get('/mahasiswa-list', staffController.getMahasiswaList);
router.get('/dosen-list', staffController.getDosenList);
router.post('/input-mahasiswa', upload.single('foto'), staffController.inputMahasiswa);
router.put('/update-mahasiswa/:npm', upload.single('foto'), staffController.updateMahasiswa);
router.delete('/delete-mahasiswa/:npm', staffController.deleteMahasiswa);
router.get('/cetak-krs', staffController.getCetakKRS);
router.get('/cetak-khs', staffController.getCetakKHS);
router.get('/rekap-absensi', absensiController.getRekapAbsensi);
router.get('/jadwal-aktif', pertemuanController.getJadwalAktif);
router.post('/input-dosen', upload.single('foto'), staffController.inputDosen);
router.put('/update-dosen/:nidn', upload.single('foto'), staffController.updateDosen);
router.delete('/delete-dosen/:nidn', staffController.deleteDosen);
router.get('/profile', verifyRole('pegawai'), pegawaiProfileController.getProfile);
router.put('/profile', verifyRole('pegawai'), pegawaiProfileController.updateProfile);

// Pegawai-only master data & jadwal
router.get('/matakuliah', verifyRole('pegawai'), pegawaiMatkulController.getMatkulList);
router.post('/matakuliah', verifyRole('pegawai'), pegawaiMatkulController.createMatkul);
router.put('/matakuliah/:kode', verifyRole('pegawai'), pegawaiMatkulController.updateMatkul);
router.delete('/matakuliah/:kode', verifyRole('pegawai'), pegawaiMatkulController.deleteMatkul);

router.get('/ruang', verifyRole('pegawai'), pegawaiRuangController.getRuangList);
router.post('/ruang', verifyRole('pegawai'), pegawaiRuangController.createRuang);
router.put('/ruang/:kode', verifyRole('pegawai'), pegawaiRuangController.updateRuang);
router.delete('/ruang/:kode', verifyRole('pegawai'), pegawaiRuangController.deleteRuang);

router.get('/jadwal', verifyRole('pegawai'), pegawaiJadwalController.getJadwalList);
router.post('/jadwal', verifyRole('pegawai'), pegawaiJadwalController.createJadwal);
router.put('/jadwal/:id', verifyRole('pegawai'), pegawaiJadwalController.updateJadwal);
router.delete('/jadwal/:id', verifyRole('pegawai'), pegawaiJadwalController.deleteJadwal);

module.exports = router;
