import { useState, useEffect } from "react";
import API_URL from "./api";

function App() {
  const [urls, setUrls] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]); // ✅ historial agregado
  const [status, setStatus] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Verificar estado del backend con /health
  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => setStatus(res.ok ? "up" : "down"))
      .catch(() => setStatus("down"));
  }, []);

  const handleScan = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urls.split("\n") }),
      });

      if (!response.ok) throw new Error("Error en el backend");

      const data = await response.json();
      setResults(data.results || []);

      // ✅ Guardar en historial
      const timestamp = new Date().toLocaleString();
      setHistory((prev) => [
        { time: timestamp, results: data.results || [] },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo conectar con el backend. Intenta nuevamente.");
      setStatus("down");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Función para renderizar chips de fuentes o latinotype
  const renderTags = (items, color = "gray") =>
    items
      .map((i) => i.trim())
      .filter((i) => i.length > 0)
      .map((i, idx) => (
        <span
          key={idx}
          className={`px-3 py-1 text-xs rounded-full bg-${color}-200 dark:bg-${color}-600 text-${color}-900 dark:text-${color}-100`}
        >
          {i}
        </span>
      ));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Latinotype Scanner</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === "up"
              ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200"
              : status === "down"
              ? "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200"
          }`}
        >
          {status === "up"
            ? "🟢 Activo"
            : status === "down"
            ? "🔴 Caído"
            : "⏳ Verificando..."}
        </span>
      </header>

      {/* Main content */}
      <main className="flex-grow flex justify-center items-start py-10">
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <textarea
            className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 mb-4"
            rows="3"
            placeholder="Ingresa una o varias URLs (una por línea)"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
          />

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={handleScan}
              disabled={loading}
              className={`px-5 py-2 rounded-lg shadow-md transition text-white ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Escaneando...
                </span>
              ) : (
                "🚀 Escanear"
              )}
            </button>
            <button
              onClick={() => {
                setUrls("");
                setResults([]);
              }}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md transition disabled:opacity-50"
            >
              🧹 Limpiar
            </button>
          </div>

          {/* Resultados actuales */}
          {results.length > 0 && (
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="p-3">URL</th>
                    <th className="p-3">Fuentes Detectadas</th>
                    <th className="p-3">Latinotype</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="p-3 text-blue-600 underline">
                        <a href={r.url} target="_blank" rel="noreferrer">
                          {r.url}
                        </a>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          {renderTags(r.fuentesDetectadas, "gray")}
                        </div>
                      </td>
                      <td className="p-3">
                        {r.latinotype !== "Ninguna" ? (
                          <div className="flex flex-wrap gap-2">
                            {renderTags(r.latinotype.split(","), "green")}
                          </div>
                        ) : (
                          <span className="italic text-gray-500">Ninguna</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Historial */}
          {history.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">
                📜 Historial de escaneos
              </h2>
              <ul className="space-y-3">
                {history.map((h, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 shadow"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {h.time}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-gray-200 dark:bg-gray-600">
                          <tr>
                            <th className="p-2">URL</th>
                            <th className="p-2">Fuentes</th>
                            <th className="p-2">Latinotype</th>
                          </tr>
                        </thead>
                        <tbody>
                          {h.results.map((r, i) => (
                            <tr key={i} className="border-t dark:border-gray-500">
                              <td className="p-2 text-blue-600 underline">
                                <a href={r.url} target="_blank" rel="noreferrer">
                                  {r.url}
                                </a>
                              </td>
                              <td className="p-2">
                                <div className="flex flex-wrap gap-2">
                                  {renderTags(r.fuentesDetectadas, "gray")}
                                </div>
                              </td>
                              <td className="p-2">
                                {r.latinotype !== "Ninguna" ? (
                                  <div className="flex flex-wrap gap-2">
                                    {renderTags(
                                      r.latinotype.split(","),
                                      "green"
                                    )}
                                  </div>
                                ) : (
                                  <span className="italic text-gray-500">
                                    Ninguna
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Latinotype Scanner
      </footer>
    </div>
  );
}

export default App;
