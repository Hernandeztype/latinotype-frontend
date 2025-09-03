// src/api.js
// Usa la variable de entorno VITE_API_URL definida en Vercel/Render
// Ejemplo: VITE_API_URL=https://latinotype-backend.onrender.com

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("❌ ERROR: VITE_API_URL no está definido en las variables de entorno");
}

export default API_URL;
