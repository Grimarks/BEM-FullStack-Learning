// LIVE CODING: section Hero
// Target: layar pertama portfolio, disusun layer demi layer:
//   1. gambar kota    (/images/hero-city-1280.webp & hero-city-2400.webp)
//   2. gradien gelap  (supaya teks terbaca)
//   3. stiker         (<Decor />)
//   4. teks & tombol  (<Eyebrow />, <h1>, <Button />)
// Isi teks ambil dari src/data/profile.js (fullName, role, heroCorner, cvUrl).

export default function Hero() {
    return (
        <section id="top" className="grid min-h-svh place-items-center bg-night text-cream">
            <p>Hero: kita bangun bareng di live coding</p>
        </section>
    );
}
