import {Mail, Link, MapPin, FileText} from "lucide-react";
import {
    siReact,
    siNodedotjs,
    siTypescript,
    siPostgresql,
    siGithub,
    siInstagram,
    siWhatsapp,
} from "simple-icons";

function BrandSvg({icon, className, colored = false}){
    return(
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill={colored ? `#${icon.hex}` : "currentColor"}
            aria-hidden="true"
            >
            <path d={icon.path}/>
        </svg>
    );
}

function LinkedInIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 10v9M6 6v.01M10.5 19v-5.5a3 3 0 0 1 6 0V19M10.5 10v9" strokeLinecap="round" />
        </svg>
    );
}

function FigmaLogo({ className }) {
    return (
        <svg viewBox="0 0 38 57" className={className} aria-hidden="true">
            <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
            <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
            <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
            <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
            <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
        </svg>
    );
}

const techIcons = {
    react: { name: "React", icon: siReact },
    nodejs: { name: "Node.js", icon: siNodedotjs },
    typescript: { name: "TypeScript", icon: siTypescript },
    postgresql: { name: "PostgreSQL", icon: siPostgresql },
};

export function TechLogo({id, className = "size-8"}){
    if ( id === "figma") return <FigmaLogo className={className}></FigmaLogo>;
    const tech = techIcons[id];
    return tech ? <BrandSvg icon={tech.icon} className={className} colored /> : null;
}

export const techName = (id) => (id === "figma" ? "Figma" : techIcons[id]?.name ?? id);

export function ContactIcon({ type, className = "size-5" }) {
    switch (type) {
        case "email":
            return <Mail className={className} aria-hidden="true" />;
        case "link":
            return <Link className={className} aria-hidden="true" />;
        case "location":
            return <MapPin className={className} aria-hidden="true" />;
        case "cv":
            return <FileText className={className} aria-hidden="true" />;
        case "whatsapp":
            return <BrandSvg icon={siWhatsapp} className={className} />;
        case "github":
            return <BrandSvg icon={siGithub} className={className} />;
        case "instagram":
            return <BrandSvg icon={siInstagram} className={className} />;
        case "linkedin":
            return <LinkedInIcon className={className} />;
        default:
            return null;
    }
}