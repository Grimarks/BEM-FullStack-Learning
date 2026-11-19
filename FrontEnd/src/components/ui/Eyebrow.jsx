// LIVE CODING: komponen Eyebrow
// Target: label kecil di atas judul, dengan titik berwarna di depannya.
//   - props: children, dot = "bg-coral", className
//   - gaya: font-mono, text-label, uppercase, tracking-label
// Dipakai juga oleh SectionHeading & DetailModal, jadi semua section ikut berubah.

export default function Eyebrow({ children, className }) {
    return <p className={className}>{children}</p>;
}
