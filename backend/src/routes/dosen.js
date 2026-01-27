const express = require("express");
const router = express.Router();
const pertemuanController = require("../controllers/pertemuan_controller");
const absensiController = require("../controllers/absensi_controller");
const nilaiController = require("../controllers/nilai_controller");
const bimbinganController = require("../controllers/bimbingan_controller");
const dosenProfileController = require("../controllers/dosen_profile_controller");
const { verifyRole } = require("../middleware/role");

router.get("/jadwal/:nidn", verifyRole('dosen'), pertemuanController.getJadwalByDsn);
router.get("/profile", verifyRole('dosen'), dosenProfileController.getProfile);
router.put("/profile", verifyRole('dosen'), dosenProfileController.updateProfile);
router.get("/dashboard/:nidn", verifyRole('dosen'), pertemuanController.getDashboardByDsn);
router.post("/pertemuan/simpan", verifyRole('dosen'), pertemuanController.createPertemuan);
router.get("/pertemuan/jadwal/:id_jadwal", verifyRole('dosen'), pertemuanController.getPertemuanByJadwal);

router.get("/pertemuan-list/:id_jadwal", verifyRole('dosen'), absensiController.getPertemuanByJadwal);
router.get("/mahasiswa-list/:id_jadwal", verifyRole('dosen'), absensiController.getMhsForAbsen);

router.get("/absensi/cek/:id_pertemuan", verifyRole('dosen'), absensiController.cekAbsensi); 
router.post("/absensi/simpan", verifyRole('dosen'), absensiController.submitAbsensi);

router.get("/nilai/peserta/:id_jadwal", verifyRole('dosen'), nilaiController.getPesertaNilai);

router.put("/nilai/update", verifyRole('dosen'), nilaiController.updateNilaiMahasiswa);

router.get("/bimbingan/:nidn", verifyRole('dosen'), bimbinganController.getBimbinganList);
router.get("/bimbingan-krs/:nidn", verifyRole('dosen'), bimbinganController.getKrsBimbingan);
router.put("/bimbingan-krs/approval", verifyRole('dosen'), bimbinganController.updateKrsApproval);

module.exports = router;
