
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Add a console log to confirm mounting
console.log("Mounting application to root element");
createRoot(rootElement).render(<App />);
