const jwt = require('jsonwebtoken');

const verifyRole = (allowedRole) => {
    return (req, res, next) => {
        // Ambil token dari header Authorization
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Akses ditolak, token tidak ditemukan" });
        }

        try {
            // Verifikasi token (Gunakan secret key yang sama saat login)
            const decoded = jwt.verify(token, 'RAHASIA_JWT_ANDA'); 
            
            // Cek apakah role sesuai
            if (decoded.role.toLowerCase() !== allowedRole.toLowerCase()) {
                return res.status(403).json({ success: false, message: "Akses dilarang: Role tidak sesuai" });
            }

            req.user = decoded; // Simpan data user ke request
            next(); // Lanjut ke controller
        } catch (error) {
            return res.status(403).json({ success: false, message: "Token kadaluarsa atau tidak valid" });
        }
    };
};

module.exports = { verifyRole };