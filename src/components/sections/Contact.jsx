import { ArrowUp, ArrowUpRight } from "lucide-react";
import { profile } from "../../data/profile.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Container from "../ui/Container.jsx";
import Button from "../ui/Button.jsx";
import Decor from "../ui/Decor.jsx";
import { ContactIcon } from "../ui/Icons.jsx";

export default function Contach(){
    return(
        <footer
        id="kontak"
        aria-labelledby="kontak-title"
        className="relative overflow-hidden rounded-t-[2.5rem] bg-night pt-28 pb-12 text-cream [--grid-line:rgb(255_255_255/0.04)] [--dot:rgb(198_255_52/0.25)] bg-grid lg:slide"
        >
            <div className="absolute bottom-0 left-0 h-[480px] w-[480px] rounded-full bg-violet/25 blur-3xl" aria-hidden="true" />
            <div className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full bg-pink/15 blur-3xl" aria-hidden="true" />
            <div className="absolute top-16 left-0 hidden h-[560px] w-[220px] bg-dots fade-edges md:block" aria-hidden="true" />
            <div className="absolute top-40 right-0 hidden h-[560px] w-[220px] bg-dots fade-edges md:block" aria-hidden="true" />
            <Decor src="/images/cursor-white.png" className="top-28 left-[8%] w-20 -rotate-12 opacity-15" />
            <Decor src="/images/code-white.png" className="top-40 right-[8%] w-20 opacity-15" />



        </footer>
    )
}