import { StrictMode, Suspense, lazy } from "react";import { createRoot } from 'react-dom/client'
import "@fontsource/passion-one/400.css";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/dm-serif-display/400-italic.css";
import './index.css'
import App from './App.jsx'
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));
const isAdmin = window.location.pathname.startsWith("/admin");

createRoot(document.getElementById("root")).render(
    <StrictMode>
        {isAdmin ? (
            <Suspense fallback={null}>
                <AdminApp />
            </Suspense>
        ) : (
            <App />
        )}
    </StrictMode>,
);
