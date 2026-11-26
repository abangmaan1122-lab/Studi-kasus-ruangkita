# Studi Kasus Analisis Sistem & UI/UX: RuangKita

Dokumen perancangan sistem informasi dan prototipe antarmuka untuk **RuangKita** — platform katalog dan reservasi ruang kerja (*co-working space*), ruang rapat, dan hunian harian berbasis web.

---

## 1. Latar Belakang & Identifikasi Masalah
Pengelola ruang sewa skala kecil hingga menengah sering menghadapi kendala berikut:
1. **Informasi Ketersediaan Tidak Real-Time:** Calon penyewa harus bertanya manual lewat chat untuk mengetahui tipe ruang yang kosong dan tarif terbarunya.
2. **Pencatatan Jadwal Rawan Bentrok:** Pemesanan yang dicatat di buku atau *spreadsheet* terpisah berisiko menimbulkan jadwal ganda (*double booking*).
3. **Minimnya Pembatasan Hak Akses Data:** Staf operasional dan administrator sering menggunakan satu akun bersama tanpa pemisahan wewenang perubahan tarif maupun laporan keuangan.

**Solusi Sistem:** Merancang sistem informasi terpusat dengan pencarian berbasis filter (**tipe ruang** dan **batas harga maksimal**), validasi jadwal otomatis di tingkat *database*, serta pembagian hak akses (*Role-Based Access Control*).

---

## 2. Analisis Kebutuhan Sistem

### A. Kebutuhan Fungsional (Functional Requirements)
* **FR-01 (Pencarian & Filter Katalog):** Pengguna dapat menyaring daftar ruang berdasarkan kategori/tipe ruang serta batas anggaran maksimal.
* **FR-02 (Penanganan Kondisi Kosong / Empty State):** Sistem menampilkan informasi yang jelas dan tombol pemulihan filter apabila kombinasi pencarian tidak menemukan ruang yang sesuai.
* **FR-03 (Pengajuan Reservasi):** Penyewa dapat memilih tanggal pemakaian, durasi, dan mengajukan reservasi ruang yang berstatus tersedia.
* **FR-04 (Manajemen Data Ruang — Admin):** Administrator dapat menambah, mengubah tarif, dan menonaktifkan unit ruang.
* **FR-05 (Verifikasi Pembayaran — Operator):** Staf operasional dapat memverifikasi bukti pembayaran dan mengubah status reservasi menjadi terkonfirmasi.

### B. Kebutuhan Non-Fungsional (Non-Functional Requirements)
* **NFR-01 (Usability & Responsiveness):** Antarmuka dapat diakses dengan nyaman di layar ponsel maupun desktop dengan alur pemesanan maksimal 3 langkah.
* **NFR-02 (Keamanan Database):** Pembatasan hak akses pengguna database berdasarkan peran (*least privilege*) serta penyimpanan kata sandi terenkripsi (*hashed*).
* **NFR-03 (Integritas Data):** Penerapan *Primary Key*, *Foreign Key*, dan *Constraint* pada tabel relasional untuk mencegah data yatim (*orphan records*).

---

## 3. Alur Proses Bisnis (To-Be Flowchart)

```mermaid
flowchart TD
    A[Mulai: Pengguna Buka Katalog] --> B[Filter Tipe Ruang & Harga Maksimal]
    B --> C{Data Ruang Ditemukan?}
    C -- Tidak --> D[Tampilkan Empty State & Tombol Reset Filter]
    D --> B
    C -- Ya --> E[Pilih Ruang & Cek Detail Fasilitas]
    E --> F[Isi Form Tanggal & Durasi Sewa]
    F --> G[Simpan Reservasi Status: PENDING]
    G --> H[Verifikasi Pembayaran oleh Operator]
    H --> I[Update Status: CONFIRMED & Kunci Jadwal]
    I --> J[Selesai].

---

## 4.Perancangan Database Relasional (ERD)

    erDiagram
    USERS ||--o{ BOOKINGS : "membuat"
    ROOMS ||--o{ BOOKINGS : "dipesan_dalam"
    BOOKINGS ||--|| PAYMENTS : "memiliki"

    USERS {
        int user_id PK
        varchar full_name
        varchar email UK
        varchar password_hash
        enum role "admin, operator, penyewa"
        timestamp created_at
    }

    ROOMS {
        int room_id PK
        varchar room_code UK
        varchar room_name
        enum room_type "Private Office, Meeting Room, Co-Working, Studio"
        int capacity
        decimal price_per_day
        enum status "available, maintenance"
    }

    BOOKINGS {
        int booking_id PK
        varchar booking_code UK
        int user_id FK
        int room_id FK
        date start_date
        int duration_days
        decimal total_amount
        enum booking_status "pending, confirmed, cancelled"
    }

    PAYMENTS {
        int payment_id PK
        int booking_id FK
        varchar payment_method
        decimal amount_paid
        enum payment_status "unpaid, verified, rejected"
        datetime paid_at
    }.

---
## 5.Perancangan UI/UX & Wireframe Flow

1.Halaman Eksplorasi Katalog: Menampilkan header ringkas, panel filter interaktif (Dropdown Tipe Ruang + Slider Harga Maksimal), dan kartu ruang dengan indikator kapasitas serta harga transparan.

2.Halaman / State Hasil Kosong (Empty State): Didesain khusus agar pengguna tidak menemui layar kosong yang membingungkan saat filter terlalu ketat, dilengkapi saran tindakan dan tombol reset satu klik.

3.Modal / Layar Detail & Reservasi: Menampilkan ringkasan biaya otomatis (harga_per_hari x durasi) sebelum pengguna mengirimkan pengajuan sewa.