---

### 2. `database_schema.sql`

```sql
-- ============================================================================
-- RuangKita — Skema Database Relasional MySQL & Pengaturan Hak Akses Role
-- Dokumentasi Teknis Studi Kasus Sistem Informasi
-- ============================================================================

CREATE DATABASE IF NOT EXISTS db_ruangkita
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_ruangkita;

-- 1. Tabel Master Pengguna (Users)
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'operator', 'penyewa') NOT NULL DEFAULT 'penyewa',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabel Master Ruang (Rooms)
CREATE TABLE rooms (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  room_code VARCHAR(20) NOT NULL UNIQUE,
  room_name VARCHAR(100) NOT NULL,
  room_type ENUM('Private Office', 'Meeting Room', 'Co-Working', 'Studio') NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0),
  price_per_day DECIMAL(12, 2) NOT NULL CHECK (price_per_day >= 0),
  status ENUM('available', 'maintenance') NOT NULL DEFAULT 'available',
  INDEX idx_room_filter (room_type, price_per_day, status)
) ENGINE=InnoDB;

-- 3. Tabel Transaksi Reservasi (Bookings)
CREATE TABLE bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_code VARCHAR(30) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  start_date DATE NOT NULL,
  duration_days INT NOT NULL CHECK (duration_days >= 1),
  total_amount DECIMAL(12, 2) NOT NULL,
  booking_status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
  CONSTRAINT fk_booking_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE RESTRICT,
  INDEX idx_booking_schedule (room_id, start_date, booking_status)
) ENGINE=InnoDB;

-- 4. Tabel Pembayaran (Payments)
CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL UNIQUE,
  payment_method VARCHAR(50) NOT NULL,
  amount_paid DECIMAL(12, 2) NOT NULL,
  payment_status ENUM('unpaid', 'verified', 'rejected') NOT NULL DEFAULT 'unpaid',
  paid_at DATETIME NULL,
  CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- KEAMANAN DATABASE: IMPLEMENTASI PRINCIPLE OF LEAST PRIVILEGE (RBAC)
-- ============================================================================

-- Role Operator: Hanya boleh membaca katalog dan memverifikasi reservasi/pembayaran
-- Tidak diizinkan menghapus master ruang atau mengubah hak akses user
CREATE USER IF NOT EXISTS 'ruangkita_operator'@'localhost' IDENTIFIED BY 'OpStrongPass#2026';
GRANT SELECT ON db_ruangkita.rooms TO 'ruangkita_operator'@'localhost';
GRANT SELECT, UPDATE ON db_ruangkita.bookings TO 'ruangkita_operator'@'localhost';
GRANT SELECT, INSERT, UPDATE ON db_ruangkita.payments TO 'ruangkita_operator'@'localhost';

-- Role Admin: Kendali penuh pada database db_ruangkita
CREATE USER IF NOT EXISTS 'ruangkita_admin'@'localhost' IDENTIFIED BY 'AdmStrongPass#2026';
GRANT ALL PRIVILEGES ON db_ruangkita.* TO 'ruangkita_admin'@'localhost';

FLUSH PRIVILEGES;