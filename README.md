# Portofolio Andini Papa Sulima

Situs portofolio pribadi Andini Papa Sulima, mahasiswa Informatika UPN "Veteran" Yogyakarta.
Live: https://andinipapasulima.github.io/

Situs ini statis (HTML, CSS, JavaScript tanpa framework) dan dideploy lewat GitHub Pages dari branch `main`.

## Fitur

- Dua bahasa (Indonesia dan Inggris) dengan pilihan tersimpan di `localStorage`
- Responsif, dengan menu hamburger di layar di bawah 760px
- Gambar WebP dengan fallback JPEG/PNG dan `srcset`
- Meta SEO, Open Graph, dan data terstruktur JSON-LD
- Animasi yang menghormati `prefers-reduced-motion`

## Struktur

```
index.html        Halaman utama
css/style.css     Semua gaya
js/main.js        Bahasa, menu mobile, salin kontak, scroll-spy, animasi angka
img/              Gambar teroptimasi (WebP + fallback), og-image, ikon
favicon.svg       Favicon
cv/               Tempat file CV (PDF)
```

## Menjalankan di komputer sendiri

```bash
python -m http.server 8000
```

Lalu buka http://localhost:8000.

## Cara memperbarui konten

- **CV**: simpan file sebagai `cv/CV-Andini-Papa-Sulima.pdf`. Tombol "Unduh CV" muncul otomatis setelah file ada.
- **Live demo proyek**: di `index.html`, setiap kartu proyek punya link "Live demo" yang dikomentari. Hapus komentarnya dan isi URL.
- **Sertifikat & pencapaian**: isi item di section `#sertifikat`, hapus atribut `hidden`, lalu tambahkan link ke menu.
- **Gambar proyek baru**: simpan versi lebar 640 dan 1000 piksel dalam WebP, plus JPEG 1000 piksel sebagai fallback, di folder `img/`.
- **Teks dua bahasa**: teks Indonesia ditulis di isi elemen, versi Inggris di atribut `data-en`.
