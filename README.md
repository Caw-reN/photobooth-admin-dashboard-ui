# 📸 Photobooth Admin Dashboard

Dashboard admin modern bergaya **Neobrutalism** untuk mengelola sistem mesin photobooth. Dibangun menggunakan React, TypeScript, dan Tailwind CSS, aplikasi ini menyediakan antarmuka interaktif untuk manajemen frame, pemantauan transaksi, galeri foto, dan konfigurasi perangkat keras.

## ✨ Fitur Utama

- **📊 Overview Dashboard (`Home.tsx`)**
  - Pemantauan metrik secara *real-time* (Pendapatan, Sesi Berhasil, *Error Rate*).
  - Status sistem (Koneksi Internet, Payment Gateway, Kapasitas Storage).
  - Grafik aktivitas harian interaktif (menggunakan Recharts).

- **🖼️ Frame & Templates Manager (`Frames.tsx`)**
  - *Drag-and-drop* upload untuk desain frame overlay (.png).
  - **Interactive Coordinate Mapper:** Fitur interaktif untuk memetakan area foto (drag, resize) pada frame.
  - **Auto-Detect Areas:** Mendeteksi area transparan/putih secara otomatis menggunakan Canvas API.

- **💳 Manajemen Transaksi (`Transactions.tsx`)**
  - Tabel riwayat pembayaran dengan fitur *search*, *filter* status, dan paginasi.
  - Detail transaksi interaktif untuk proses *debugging* *Webhook Payload Log* dari payment gateway.

- **🎞️ Galeri & Storage (`Gallery.tsx`)**
  - Tampilan *masonry grid* untuk foto-foto yang tersimpan.
  - *Bulk actions* (Pilih semua, Download, Hapus).
  - Indikator kapasitas *Local Server SSD* dan pengaturan *Auto-Cleanup* (Cron Job).

- **⚙️ System Settings (`Settings.tsx`)**
  - **General:** Pengaturan nama booth, lokasi, dan harga per sesi.
  - **Payment Gateway:** Konfigurasi integrasi pembayaran (mendukung Midtrans dengan *Client Key* & *Server Key*).
  - **Camera & Hardware:** Pemilihan *device* kamera, resolusi tangkapan, dan pengaturan *countdown timer*.

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework:** React 18 (dengan TypeScript)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (dengan custom konfigurasi Neobrutalism) & `clsx` + `tailwind-merge`
- **Icons:** Lucide React
- **Charts:** Recharts
- **Drag & Drop:** React Dropzone

## 🎨 Konsep Desain (UI/UX)

Aplikasi ini menggunakan gaya **Neobrutalism** yang dicirikan dengan:
- Palet warna cerah dan *playful* (Teal, Amber, Rose, Blue).
- Garis tepi (border) gelap yang tebal (`border-2 border-slate-900`).
- Bayangan pekat / *Hard shadows* (`shadow-[4px_4px_0px_0px_#0f172a]`).
- Efek hover yang memberikan *feedback* interaktif (translasi koordinat).

## 🚀 Cara Instalasi & Menjalankan di Lokal

Pastikan Anda sudah menginstal Node.js di sistem Anda.

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/Caw-reN/photobooth-admin-dashboard-ui.git


2. **Clone repositori ini:**
   ```bash
   cd photobooth-admin-dashboard-ui

3. **Install dependensi:**
   ```bash
   npm install
   # atau menggunakan yarn / pnpm
   yarn install

4. **Jalankan development server:**
   ```bash
   npm run dev

5. **Buka di Browser:** Kunjungi http://localhost:5173 (atau port yang disediakan oleh Vite) di browser Anda.


## 📂 Struktur Folder 

```bash
   src/
   ├── pages/
   │   ├── Home.tsx         # Dashboard Overview
   │   ├── Frames.tsx       # Manajemen Frame & Mapping Area
   │   ├── Gallery.tsx      # Galeri Foto & Monitor SSD
   │   ├── Transactions.tsx # Log Transaksi & Webhook
   │   └── Settings.tsx     # Konfigurasi Hardware & Payment
   ├── App.tsx              # Konfigurasi Routing & Layout Sidebar
   ├── index.css            # Setup Tailwind & Custom CSS Neobrutalism
   └── main.tsx             # Entry point React

   