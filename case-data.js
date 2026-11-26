/**
 * ============================================================================
 * Data Studi Kasus RuangKita (case-data.js)
 * Berisi tabel kebutuhan sistem, kamus database, dan data ruang prototipe UI.
 * ============================================================================
 */

const REQUIREMENTS_DATA = [
  {
    code: 'FR-01',
    type: 'Fungsional',
    desc: 'Pengguna dapat menyaring katalog berdasarkan tipe ruang dan batas harga maksimal.',
    priority: 'Tinggi'
  },
  {
    code: 'FR-02',
    type: 'Fungsional',
    desc: 'Sistem menampilkan Empty State informatif beserta tombol reset jika hasil pencarian kosong.',
    priority: 'Tinggi'
  },
  {
    code: 'FR-03',
    type: 'Fungsional',
    desc: 'Perhitungan otomatis total biaya sewa berdasarkan tarif harian dan durasi hari.',
    priority: 'Tinggi'
  },
  {
    code: 'NFR-01',
    type: 'Non-Fungsional',
    desc: 'Desain responsif yang nyaman digunakan di ponsel maupun layar laptop/desktop.',
    priority: 'Tinggi'
  },
  {
    code: 'NFR-02',
    type: 'Non-Fungsional',
    desc: 'Pemisahan hak akses database antara role Operator dan Administrator (Least Privilege).',
    priority: 'Tinggi'
  }
];

const SCHEMA_TABLES = [
  {
    tableName: 'users (Master Pengguna)',
    fields: [
      'PK user_id : INT AUTO_INCREMENT',
      '   full_name : VARCHAR(100)',
      'UK email : VARCHAR(120)',
      '   password_hash : VARCHAR(255)',
      "   role : ENUM('admin','operator','penyewa')"
    ]
  },
  {
    tableName: 'rooms (Master Ruang)',
    fields: [
      'PK room_id : INT AUTO_INCREMENT',
      'UK room_code : VARCHAR(20)',
      '   room_name : VARCHAR(100)',
      '   room_type : ENUM(...)',
      '   price_per_day : DECIMAL(12,2)'
    ]
  },
  {
    tableName: 'bookings (Transaksi Reservasi)',
    fields: [
      'PK booking_id : INT AUTO_INCREMENT',
      'UK booking_code : VARCHAR(30)',
      'FK user_id -> users(user_id)',
      'FK room_id -> rooms(room_id)',
      '   start_date : DATE | duration_days : INT'
    ]
  },
  {
    tableName: 'payments (Verifikasi Pembayaran)',
    fields: [
      'PK payment_id : INT AUTO_INCREMENT',
      'FK booking_id -> bookings(booking_id)',
      '   payment_method : VARCHAR(50)',
      '   amount_paid : DECIMAL(12,2)',
      "   payment_status : ENUM('unpaid','verified','rejected')"
    ]
  }
];

const SQL_SNIPPET = `CREATE TABLE bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_code VARCHAR(30) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  start_date DATE NOT NULL,
  duration_days INT NOT NULL CHECK (duration_days >= 1),
  total_amount DECIMAL(12, 2) NOT NULL,
  booking_status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_booking_room FOREIGN KEY (room_id) REFERENCES rooms(room_id)
) ENGINE=InnoDB;

-- Pembatasan Hak Akses Role Operator (Least Privilege)
GRANT SELECT ON db_ruangkita.rooms TO 'ruangkita_operator'@'localhost';
GRANT SELECT, UPDATE ON db_ruangkita.bookings TO 'ruangkita_operator'@'localhost';`;

const PROTOTYPE_ROOMS = [
  {
    id: 'RM-01',
    name: 'Meja Co-Working Zona Fokus',
    type: 'Co-Working',
    capacity: 1,
    price: 75000,
    facilities: 'Wi-Fi 100 Mbps, stopkontak pribadi, akses pantry kopi & teh.'
  },
  {
    id: 'RM-02',
    name: 'Ruang Rapat Melati (Kapasitas 6 Orang)',
    type: 'Meeting Room',
    capacity: 6,
    price: 200000,
    facilities: 'Smart TV 55 inci, papan tulis kaca, AC, dan koneksi HDMI/Wireless.'
  },
  {
    id: 'RM-03',
    name: 'Private Office Tim Kecil (4 Kursi)',
    type: 'Private Office',
    capacity: 4,
    price: 350000,
    facilities: 'Ruang tertutup kedap suara, 4 meja ergonomis, loker kunci.'
  },
  {
    id: 'RM-04',
    name: 'Studio Konten & Podcast Mini',
    type: 'Studio',
    capacity: 3,
    price: 450000,
    facilities: 'Peredam akustik, 2 lampu softbox, latar belakang polos.'
  },
  {
    id: 'RM-05',
    name: 'Booth Kolaborasi Santai',
    type: 'Co-Working',
    capacity: 2,
    price: 125000,
    facilities: 'Sofa ergonomis, meja diskusi ringkas, Wi-Fi kecepatan tinggi.'
  },
  {
    id: 'RM-06',
    name: 'Ruang Presentasi Utama',
    type: 'Meeting Room',
    capacity: 12,
    price: 475000,
    facilities: 'Proyektor Full HD, sistem audio rapat, dan papan tulis besar.'
  }
];