const express = require("express");
const router = express.Router();
const matkulController = require("../controllers/matkul_controller");
const { verifyRole } = require("../middleware/role");

router.get("/", matkulController.getAllMatkul);

router.post("/simpan-krs", verifyRole('mahasiswa'), matkulController.simpanKRS);

module.exports = router;