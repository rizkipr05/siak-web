const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/test-conn", (req, res) => {
    db.query("SELECT 1 + 1 AS hasil", (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "MySQL OK", hasil: rows[0].hasil });
    });
});

router.get("/mahasiswa", (req, res) => {
    db.query("SELECT * FROM mahasiswa", (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows);
    });
});


module.exports = router;
