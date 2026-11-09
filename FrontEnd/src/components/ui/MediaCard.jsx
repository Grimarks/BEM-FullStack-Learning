import Chip from "./Chip.jsx";
export default function MediaCard({ image, alt, tagLeft, tagRight, onOpen }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="group relative block aspect-[582/380] w-full overflow-hidden rounded-card border-[3px] border-edge bg-white text-left shadow-card transition duration-300 hover:-translate-y-1 hover:border-violet/50"
        >
            <img
                src={image}
                alt={alt}
                loading="lazy"
                className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
        <Chip>{tagLeft}</Chip>
        <Chip>{tagRight}</Chip>
      </span>
        </button>
    );
}