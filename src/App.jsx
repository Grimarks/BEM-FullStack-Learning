// import Navbar from "./components/layout/Navbar.jsx";
import Hero from "./components/sections/Hero.jsx";
import About from "./components/sections/About.jsx";
// import Journey from "./components/sections/Journey.jsx";
// import Projects from "./components/sections/Projects.jsx";
// import Certificates from "./components/sections/Certificates.jsx";
import Contact from "./components/sections/Contact.jsx";

export default function App(){
    return(
        <>
        {/*<Navbar />*/}
        <main>
            <Hero></Hero>
            <About></About>
            {/*<Journey></Journey>*/}
            {/*<Projects></Projects>*/}
            {/*<Certificates></Certificates>*/}
        </main>

        <Contact></Contact>
        </>
    );
}