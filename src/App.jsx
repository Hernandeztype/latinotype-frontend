import { useState, useEffect } from "react";
import API_URL from "./api"; // 👈 importamos la URL desde api.js

function App() {
  const [urls, setUrls] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("checking"); // checking | up | down

  // Verificar si el backend está vivo
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (res.ok) {
          setStatus("up");
        } else {
          setStatus("down");
        }
      })
      .catch(() => setStatus("down"));
  }, []);

  const handleScan = async () => {
    try {
      const response = await fetch(`${API_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urls.split("\n") }),
      });

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error:", error);
      setStatus("down");
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Latinotype Scanner</h1>
      <p className="mb-4">
        Estado del servidor:{" "}
        {status === "up" ? "🟢 Activo" : status === "down" ? "🔴 Caído" : "⏳ Verificando..."}
      </p>

      <textarea
        className="border p-2 w-full mb-4"
        rows="3"
        placeholder="Ingresa una o varias URLs (una por línea)"
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
      ></textarea>

      <div className="space-x-2 mb-6">
        <button
          onClick={handleScan}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🚀 Escanear
        </button>
        <button
          onClick={() => {
            setUrls("");
            setResults([]);
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          🧹 Limpiar
        </button>
      </div>

      <div>
        {results.length > 0 && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border p-2">URL</th>
                <th className="border p-2">Fuentes Detectadas</th>
                <th className="border p-2">Latinotype</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td className="border p-2 text-blue-600 underline">
                    <a href={r.url} target="_blank" rel="noreferrer">
                      {r.url}
                    </a>
                  </td>
                  <td className="border p-2">{r.fuentesDetectadas.join(", ")}</td>
                  <td className="border p-2">{r.latinotype}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <footer className="mt-8 text-sm text-gray-600">
        © 2025 Latinotype Scanner
      </footer>
    </div>
  );
}

export default App;
