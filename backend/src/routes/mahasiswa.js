const express = require("express");
const router = express.Router();
const mahasiswaController = require("../controllers/mahasiswa_controller");
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
const { verifyRole } = require("../middleware/role");

router.get("/profile", verifyRole('mahasiswa'), mahasiswaController.getProfile);
router.put("/profile", verifyRole('mahasiswa'), mahasiswaController.updateProfile);
router.put("/profile/photo", verifyRole('mahasiswa'), upload.single('foto'), mahasiswaController.updateProfilePhoto);
router.get("/khs", verifyRole('mahasiswa'), mahasiswaController.getKHS);
router.get("/transkrip-sementara", verifyRole('mahasiswa'), mahasiswaController.getTranscriptSementara);
router.get("/absensi", verifyRole('mahasiswa'), mahasiswaController.getMyAbsensi);
router.get("/nilai", verifyRole('mahasiswa'), mahasiswaController.getMyNilai);

module.exports = router;