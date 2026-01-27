const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const testRoutes = require("./src/routes/test");
const authRoutes = require("./src/routes/auth");
const matkulRoutes = require("./src/routes/matkul");
const krsRoutes = require("./src/routes/krs");
const dosenRoutes = require("./src/routes/dosen");
const staffRoutes = require('./src/routes/staff');
const mahasiswaRoutes = require('./src/routes/mahasiswa');
const adminRoutes = require('./src/routes/admin');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", testRoutes);           
app.use("/api/auth", authRoutes);       
app.use("/api/matkul", matkulRoutes);   
app.use("/api/krs", krsRoutes);
app.use("/api/dosen", dosenRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`========================================`);
});
