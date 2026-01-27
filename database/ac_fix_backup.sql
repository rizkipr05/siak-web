-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: ac_fix
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `absensi`
--

DROP TABLE IF EXISTS `absensi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `absensi` (
  `id_absensi` varchar(20) NOT NULL,
  `id_pertemuan` varchar(20) NOT NULL,
  `NPM` varchar(20) NOT NULL,
  `status_hadir` enum('Hadir','Izin','Sakit','Alfa') DEFAULT 'Alfa',
  PRIMARY KEY (`id_absensi`),
  UNIQUE KEY `unique_absen` (`id_pertemuan`,`NPM`),
  KEY `NPM` (`NPM`),
  CONSTRAINT `absensi_ibfk_1` FOREIGN KEY (`id_pertemuan`) REFERENCES `pertemuan` (`id_pertemuan`) ON DELETE CASCADE,
  CONSTRAINT `absensi_ibfk_2` FOREIGN KEY (`NPM`) REFERENCES `mahasiswa` (`NPM`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `absensi`
--

LOCK TABLES `absensi` WRITE;
/*!40000 ALTER TABLE `absensi` DISABLE KEYS */;
INSERT INTO `absensi` VALUES ('ABS0001','PM003','230840031','Sakit'),('ABS0002','PM005','230840031','Sakit');
/*!40000 ALTER TABLE `absensi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academic_periods`
--

DROP TABLE IF EXISTS `academic_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_periods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tahun_ajaran` varchar(9) NOT NULL,
  `semester` enum('Ganjil','Genap') NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_periods`
--

LOCK TABLES `academic_periods` WRITE;
/*!40000 ALTER TABLE `academic_periods` DISABLE KEYS */;
/*!40000 ALTER TABLE `academic_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id_admin` varchar(20) NOT NULL,
  `nama_admin` text NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `id_user` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_admin`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('A01','Hengky Hengker','admin@siak.com','ADM001');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dosen`
--

DROP TABLE IF EXISTS `dosen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dosen` (
  `NIDN` varchar(20) NOT NULL,
  `Nama` text NOT NULL,
  `Gelar` text,
  `JenisKelamin` enum('L','P') NOT NULL,
  `Alamat` text,
  `NoHP` text,
  `Foto` varchar(255) DEFAULT 'default_dsn.jpg',
  `id_user` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`NIDN`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `dosen_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dosen`
--

LOCK TABLES `dosen` WRITE;
/*!40000 ALTER TABLE `dosen` DISABLE KEYS */;
INSERT INTO `dosen` VALUES ('110101','Lamhot Sitorus','','L','ffjefj','dvedged','1768983682567.jpg','DSN001'),('110102','Desinta Purba','','P','','','default_dsn.jpg','DSN002');
/*!40000 ALTER TABLE `dosen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jadwal`
--

DROP TABLE IF EXISTS `jadwal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jadwal` (
  `id_jadwal` varchar(20) NOT NULL,
  `KodeMK` varchar(15) NOT NULL,
  `NIDN` varchar(20) NOT NULL,
  `Kelas` enum('A','B','C','D','P') NOT NULL,
  PRIMARY KEY (`id_jadwal`),
  KEY `KodeMK` (`KodeMK`),
  KEY `NIDN` (`NIDN`),
  CONSTRAINT `jadwal_ibfk_1` FOREIGN KEY (`KodeMK`) REFERENCES `matakuliah` (`KodeMK`),
  CONSTRAINT `jadwal_ibfk_2` FOREIGN KEY (`NIDN`) REFERENCES `dosen` (`NIDN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jadwal`
--

LOCK TABLES `jadwal` WRITE;
/*!40000 ALTER TABLE `jadwal` DISABLE KEYS */;
INSERT INTO `jadwal` VALUES ('JL001','08420010404','110101','A'),('JL002','08420010404','110101','B'),('JL003','08420010404','110101','C'),('JL004','08420010404','110101','D'),('JL005','00901100102','110101','A'),('JL006','00901100102','110101','B'),('JL007','00901100102','110101','C'),('JL008','00901100102','110101','D'),('JL009','08440030402','110101','A'),('JL010','08440030402','110101','B'),('JL011','08440030402','110101','C'),('JL012','08440030402','110101','D'),('JL013','08420050403','110101','A'),('JL014','08420050403','110101','B'),('JL015','08420050403','110101','C'),('JL016','08420050403','110101','D'),('JL017','08440020403','110101','A'),('JL018','08440020403','110101','B'),('JL019','08440020403','110101','C'),('JL020','08440020403','110101','D'),('JL021','08440040403','110101','A'),('JL022','08440040403','110101','B'),('JL023','08440040403','110101','C'),('JL024','08440040403','110101','D'),('JL025','08440060402','110101','A'),('JL026','08440060402','110101','B'),('JL027','08440060402','110101','C'),('JL028','08440060402','110101','D'),('JL029','00901100302','110101','A'),('JL030','00901100302','110101','B'),('JL031','00901100302','110101','C'),('JL032','00901100302','110101','D'),('JL033','08420070404','110102','A'),('JL034','08420070404','110102','B'),('JL035','08420070404','110102','C'),('JL036','08420070404','110102','D'),('JL037','00901100402','110102','A'),('JL038','00901100402','110102','B'),('JL039','00901100402','110102','C'),('JL040','00901100402','110102','D'),('JL041','08420110402','110102','A'),('JL042','08420110402','110102','B'),('JL043','08420110402','110102','C'),('JL044','08420110402','110102','D'),('JL045','00901100202','110102','A'),('JL046','00901100202','110102','B'),('JL047','00901100202','110102','C'),('JL048','00901100202','110102','D'),('JL049','08420080403','110102','A'),('JL050','08420080403','110102','B'),('JL051','08420080403','110102','C'),('JL052','08420080403','110102','D'),('JL053','08420100402','110102','A'),('JL054','08420100402','110102','B'),('JL055','08420100402','110102','C'),('JL056','08420100402','110102','D'),('JL057','08440090404','110102','A'),('JL058','08440090404','110102','B'),('JL059','08440090404','110102','C'),('JL060','08440090404','110102','D'),('JL061','08420130404','110101','A'),('JL062','08420130404','110101','B'),('JL063','08420130404','110101','C'),('JL064','08420130404','110101','D'),('JL065','08420120404','110101','A'),('JL066','08420120404','110101','B'),('JL067','08420120404','110101','C'),('JL068','08420120404','110101','D'),('JL069','08410150402','110101','A'),('JL070','08410150402','110101','B'),('JL071','08410150402','110101','C'),('JL072','08410150402','110101','D'),('JL073','08420170403','110101','A'),('JL074','08420170403','110101','B'),('JL075','08420170403','110101','C'),('JL076','08420170403','110101','D'),('JL077','08420140404','110101','A'),('JL078','08420140404','110101','B'),('JL079','08420140404','110101','C'),('JL080','08420140404','110101','D'),('JL081','08420160402','110101','A'),('JL082','08420160402','110101','B'),('JL083','08420160402','110101','C'),('JL084','08420160402','110101','D'),('JL085','08420210404','110102','A'),('JL086','08420210404','110102','B'),('JL087','08420210404','110102','C'),('JL088','08420210404','110102','D'),('JL089','08420200402','110102','A'),('JL090','08420200402','110102','B'),('JL091','08420200402','110102','C'),('JL092','08420200402','110102','D'),('JL093','08430230403','110102','A'),('JL094','08430230403','110102','B'),('JL095','08430230403','110102','C'),('JL096','08430230403','110102','D'),('JL097','08420180404','110102','A'),('JL098','08420180404','110102','B'),('JL099','08420180404','110102','C'),('JL100','08420180404','110102','D'),('JL101','08430220403','110102','A'),('JL102','08430220403','110102','B'),('JL103','08430220403','110102','C'),('JL104','08430220403','110102','D'),('JL105','08430190403','110102','A'),('JL106','08430190403','110102','B'),('JL107','08430190403','110102','C'),('JL108','08430190403','110102','D'),('JL109','08420250404','110101','A'),('JL110','08420250404','110101','B'),('JL111','08420250404','110101','C'),('JL112','08420250404','110101','D'),('JL113','08430240404','110101','A'),('JL114','08430240404','110101','B'),('JL115','08430240404','110101','C'),('JL116','08430240404','110101','D'),('JL117','08430260404','110101','A'),('JL118','08430260404','110101','B'),('JL119','08430260404','110101','C'),('JL120','08430260404','110101','D'),('JL121','08430270404','110101','A'),('JL122','08430270404','110101','B'),('JL123','08430270404','110101','C'),('JL124','08430270404','110101','D'),('JL125','08431040404','110101','P'),('JL126','08440060402','110102','A');
/*!40000 ALTER TABLE `jadwal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `krsnil`
--

DROP TABLE IF EXISTS `krsnil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `krsnil` (
  `id_krs` varchar(20) NOT NULL,
  `TahunAjaran` varchar(10) NOT NULL,
  `SemesterAkademik` enum('Ganjil','Genap') NOT NULL,
  `NPM` varchar(20) NOT NULL,
  `id_jadwal` varchar(20) NOT NULL,
  `status_verifikasi` enum('Pending','Disetujui','Ditolak') DEFAULT 'Pending',
  `nsikap` decimal(5,2) DEFAULT '0.00',
  `ntugas` decimal(5,2) DEFAULT '0.00',
  `nuts` decimal(5,2) DEFAULT '0.00',
  `nuas` decimal(5,2) DEFAULT '0.00',
  PRIMARY KEY (`id_krs`),
  KEY `NPM` (`NPM`),
  KEY `id_jadwal` (`id_jadwal`),
  CONSTRAINT `krsnil_ibfk_1` FOREIGN KEY (`NPM`) REFERENCES `mahasiswa` (`NPM`),
  CONSTRAINT `krsnil_ibfk_2` FOREIGN KEY (`id_jadwal`) REFERENCES `jadwal` (`id_jadwal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `krsnil`
--

LOCK TABLES `krsnil` WRITE;
/*!40000 ALTER TABLE `krsnil` DISABLE KEYS */;
INSERT INTO `krsnil` VALUES ('KRS001','2025/2026','Ganjil','230840031','JL117','Disetujui',0.00,0.00,0.00,0.00),('KRS002','2025/2026','Ganjil','230840031','JL125','Disetujui',85.00,85.00,85.00,85.00),('KRS003','2025/2026','Ganjil','230840031','JL121','Disetujui',0.00,0.00,0.00,0.00),('KRS004','2025/2026','Ganjil','230840031','JL113','Disetujui',0.00,0.00,0.00,0.00),('KRS005','2025/2026','Ganjil','230840031','JL109','Pending',0.00,0.00,0.00,0.00);
/*!40000 ALTER TABLE `krsnil` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mahasiswa`
--

DROP TABLE IF EXISTS `mahasiswa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mahasiswa` (
  `NPM` varchar(20) NOT NULL,
  `Nama` text NOT NULL,
  `JenisKelamin` enum('L','P') NOT NULL,
  `TglLahir` date DEFAULT NULL,
  `Prodi` text,
  `Foto` varchar(255) DEFAULT 'default_mhs.jpg',
  `id_user` varchar(20) DEFAULT NULL,
  `NIDN_Wali` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`NPM`),
  KEY `id_user` (`id_user`),
  KEY `NIDN_Wali` (`NIDN_Wali`),
  CONSTRAINT `mahasiswa_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE,
  CONSTRAINT `mahasiswa_ibfk_2` FOREIGN KEY (`NIDN_Wali`) REFERENCES `dosen` (`NIDN`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mahasiswa`
--

LOCK TABLES `mahasiswa` WRITE;
/*!40000 ALTER TABLE `mahasiswa` DISABLE KEYS */;
INSERT INTO `mahasiswa` VALUES ('230840031','Zamiel Alfaro Davido Mahoro','L','2004-11-24','Teknik Informatika','1768974336958.png','MHS001','110101');
/*!40000 ALTER TABLE `mahasiswa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matakuliah`
--

DROP TABLE IF EXISTS `matakuliah`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matakuliah` (
  `KodeMK` varchar(15) NOT NULL,
  `NamaMatkul` varchar(100) NOT NULL,
  `SKS` int NOT NULL,
  `Prasyarat` varchar(15) DEFAULT NULL,
  `Semester` int NOT NULL,
  PRIMARY KEY (`KodeMK`),
  KEY `fk_prasyarat` (`Prasyarat`),
  CONSTRAINT `fk_prasyarat` FOREIGN KEY (`Prasyarat`) REFERENCES `matakuliah` (`KodeMK`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matakuliah`
--

LOCK TABLES `matakuliah` WRITE;
/*!40000 ALTER TABLE `matakuliah` DISABLE KEYS */;
INSERT INTO `matakuliah` VALUES ('00901100102','Pendidikan Agama',2,NULL,1),('00901100202','Etika',2,NULL,2),('00901100302','Pendidikan Pancasila',2,NULL,1),('00901100402','Pendidikan Kewarganegaraan',2,NULL,2),('08410150402','Etika Profesi',2,'00901100202',3),('08420010404','Algoritma & Pemrograman',4,NULL,1),('08420050403','Statistika',3,NULL,1),('08420070404','Struktur Data',4,'08420010404',2),('08420080403','Sistem Operasi',3,'08440030402',2),('08420100402','Sistem Digital',2,NULL,2),('08420110402','Organisasi & Arsitektur Komputer',2,'08440030402',2),('08420120404','Rekayasa Perangkat Lunak',4,'08420070404',3),('08420130404','Pemrograman Berorientasi Objek',4,'08420070404',3),('08420140404','Sistem Basis Data',4,NULL,3),('08420160402','Riset Operasi',2,'08420050403',3),('08420170403','Pengantar Kecerdasan Buatan',3,'08420010404',3),('08420180404','Jaringan Komputer',4,'08420080403',4),('08420200402','Metode Penelitian',2,'08420050403',4),('08420210404','Pemrograman Web',4,'08420130404',4),('08420250404','Pemrograman Visual',4,'08420210404',5),('08430190403','Pengolahan Citra Digital',3,'08420010404',4),('08430220403','Pembelajaran Mesin',3,'08420170403',4),('08430230403','UI/UX Design',3,'08420120404',4),('08430240404','Pemrograman Berbasis Platform',4,'08420210404',5),('08430260404','Data Mining',4,'08420140404',5),('08430270404','Kriptografi & Steganography',4,'08440090404',5),('08431040404','Keamanan Sistem Basis Data',4,'08420140404',5),('08440020403','Matematika Dasar',3,NULL,1),('08440030402','Pengantar Teknologi Informasi',2,NULL,1),('08440040403','Bahasa Inggris Untuk Akademis',3,NULL,1),('08440060402','Bahasa Indonesia',2,NULL,1),('08440090404','Matematika Informatika',4,'08440020403',2),('092929292','Pemrograman Mobile l',3,NULL,4);
/*!40000 ALTER TABLE `matakuliah` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pegawai`
--

DROP TABLE IF EXISTS `pegawai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pegawai` (
  `NIP` varchar(30) NOT NULL,
  `Nama` text NOT NULL,
  `Jabatan` text,
  `JenisKelamin` enum('L','P') NOT NULL,
  `Foto` varchar(255) DEFAULT 'default_pgw.jpg',
  `id_user` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`NIP`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `pegawai_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pegawai`
--

LOCK TABLES `pegawai` WRITE;
/*!40000 ALTER TABLE `pegawai` DISABLE KEYS */;
INSERT INTO `pegawai` VALUES ('199012345','Rudi Herry','Staf Akademik','L','default_pgw.jpg','PGW001');
/*!40000 ALTER TABLE `pegawai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pertemuan`
--

DROP TABLE IF EXISTS `pertemuan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pertemuan` (
  `id_pertemuan` varchar(20) NOT NULL,
  `id_jadwal` varchar(20) NOT NULL,
  `pertemuan_ke` int NOT NULL,
  `hari` enum('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu') NOT NULL,
  `tanggal` date NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL,
  `topik` varchar(255) NOT NULL,
  `deskripsi` text,
  PRIMARY KEY (`id_pertemuan`),
  UNIQUE KEY `unique_pertemuan` (`id_jadwal`,`pertemuan_ke`),
  CONSTRAINT `pertemuan_ibfk_1` FOREIGN KEY (`id_jadwal`) REFERENCES `jadwal` (`id_jadwal`) ON DELETE CASCADE,
  CONSTRAINT `chk_pertemuan` CHECK ((`pertemuan_ke` between 1 and 16))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pertemuan`
--

LOCK TABLES `pertemuan` WRITE;
/*!40000 ALTER TABLE `pertemuan` DISABLE KEYS */;
INSERT INTO `pertemuan` VALUES ('PM001','JL001',1,'Senin','2026-01-05','00:00:10','00:00:13','Linked List','Memahami Linked List'),('PM003','JL125',6,'Rabu','2026-01-14','14:00:00','16:30:00','Hashing','Mempelajari metode hashing pada password'),('PM004','JL002',1,'Senin','2026-01-05','08:00:00','09:40:00','1212','12121'),('PM005','JL125',2,'Selasa','2026-01-19','11:40:00','13:20:00','Makan dan minum','Gatau'),('PM006','JL001',2,'Senin','2026-01-22','08:00:00','09:40:00','Double Linked List','Lanjutan dari linked list'),('PM007','JL001',3,'Senin','2026-01-26','16:40:00','18:20:00','melanjutkan materi for','dbhdh');
/*!40000 ALTER TABLE `pertemuan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ruang_kelas`
--

DROP TABLE IF EXISTS `ruang_kelas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ruang_kelas` (
  `kode_ruang` varchar(20) NOT NULL,
  `nama_ruang` varchar(100) NOT NULL,
  `kapasitas` int DEFAULT NULL,
  PRIMARY KEY (`kode_ruang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ruang_kelas`
--

LOCK TABLES `ruang_kelas` WRITE;
/*!40000 ALTER TABLE `ruang_kelas` DISABLE KEYS */;
INSERT INTO `ruang_kelas` VALUES ('201','ict d',30);
/*!40000 ALTER TABLE `ruang_kelas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id_user` varchar(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('mahasiswa','dosen','admin','pegawai') NOT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('ADM001','admin_siak','123','admin'),('DSN001','110101','$2b$10$m9SxGV2XveCDQaJFgG8lhO2IEGnEdxFnAxMB3gVMxwR70tRmf6cK6','dosen'),('MHS001','230840031','$2b$10$Tvxe2ZeYq1vWCgiZOU8mPOWEbZ11vHyP2F.QMduP4naxgLkmlA0v2','mahasiswa'),('PGW001','staf_baak','123','pegawai');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_khs`
--

DROP TABLE IF EXISTS `v_khs`;
/*!50001 DROP VIEW IF EXISTS `v_khs`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_khs` AS SELECT 
 1 AS `id_krs`,
 1 AS `NPM`,
 1 AS `SemesterAkademik`,
 1 AS `TahunAjaran`,
 1 AS `NamaMatkul`,
 1 AS `SKS`,
 1 AS `NA`,
 1 AS `Huruf`,
 1 AS `Bobot`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_khs`
--

/*!50001 DROP VIEW IF EXISTS `v_khs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_khs` AS select `k`.`id_krs` AS `id_krs`,`k`.`NPM` AS `NPM`,`k`.`SemesterAkademik` AS `SemesterAkademik`,`k`.`TahunAjaran` AS `TahunAjaran`,`mk`.`NamaMatkul` AS `NamaMatkul`,`mk`.`SKS` AS `SKS`,round(((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)),2) AS `NA`,(case when (((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)) >= 80.5) then 'A' when (((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)) >= 75.5) then 'B+' when (((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)) >= 70.5) then 'B' when (((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)) >= 65.5) then 'C+' when (((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)) >= 55.5) then 'C' when (((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)) >= 45.5) then 'D' else 'E' end) AS `Huruf`,(case when (((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)) >= 80.5) then 4.0 when (((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)) >= 75.5) then 3.5 when (((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)) >= 70.5) then 3.0 when (((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)) >= 65.5) then 2.5 when (((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)) >= 55.5) then 2.0 when (((((0.1 * `k`.`nsikap`) + (0.3 * `k`.`ntugas`)) + (0.25 * `k`.`nuts`)) + (0.35 * `k`.`nuas`)) >= 45.5) then 1.0 else 0.0 end) AS `Bobot` from ((`krsnil` `k` join `jadwal` `j` on((`k`.`id_jadwal` = `j`.`id_jadwal`))) join `matakuliah` `mk` on((`j`.`KodeMK` = `mk`.`KodeMK`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-27 21:47:37
