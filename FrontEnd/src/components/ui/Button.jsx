// LIVE CODING: komponen Button
// Target: tombol pil dengan 3 variant (cream, ghost, dark).
//   - ada `href`   -> render <a>
//   - tanpa `href` -> render <button type="button">
//   - props: href, variant = "cream", className, children, ...props
// Versi sementara di bawah ini sengaja polos supaya section lain
// (Contact, DetailModal) tetap jalan sebelum Button selesai dibuat.

export default function Button({ href, children, ...props }) {
    if (href) return <a href={href} {...props}>{children}</a>;
    return <button type="button" {...props}>{children}</button>;
}
