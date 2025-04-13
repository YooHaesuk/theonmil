import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupFonts } from "./lib/fonts";

// Setup fonts
setupFonts();

createRoot(document.getElementById("root")!).render(<App />);
