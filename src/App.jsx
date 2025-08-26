import { useState, useEffect } from "react";

function App() {
  const [urls, setUrls] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("checking"); // checking | up | down

  // Verificar si el backend está vivo
  useEffect(() => {
    fetch("https://latinotype-backend.onrender.com")
      .then((res) => res.json())
      .then(() => setStatus("up"))
      .catch(() => setStatus("down"));
  }, []);

  const handleScan = async () => {
    try {
      const response = await fetch("https://latinotype-backend.onrender.com/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urls.split("\n") }),
      });

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClear = () => {
    setUrls("");
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-10 transition-colors">
      <div className="w-full max-w-5xl p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
          Latinotype Scanner
        </h1>

        {/* Estado del servidor */}
        <p className="text-center mb-6 text-gray-700 dark:text-gray-300">
          Estado del servidor:{" "}
          {status === "checking" && "⏳ Comprobando..."}
          {status === "up" && (
            <span className="text-green-600 font-semibold">🟢 Activo</span>
          )}
          {status === "down" && (
            <span className="text-red-600 font-semibold">🔴 Caído</span>
          )}
        </p>

        {/* Formulario */}
        <textarea
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          rows="3"
          placeholder="Escribe una o varias URLs (una por línea)"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
        />
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleScan}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
          >
            🚀 Escanear
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-400 hover:bg-gray-500 text-black px-5 py-2 rounded-lg shadow-md transition"
          >
            🧹 Limpiar
          </button>
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="mt-6 w-full overflow-hidden rounded-2xl shadow bg-white dark:bg-gray-700 border dark:border-gray-600">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">URL</th>
                  <th className="px-6 py-3 font-medium">Fuentes Detectadas</th>
                  <th className="px-6 py-3 font-medium">Latinotype</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => (
                  <tr
                    key={idx}
                    className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    {/* URL */}
                    <td className="px-6 py-4 text-blue-600 underline">
                      <a href={r.url} target="_blank" rel="noreferrer">
                        {r.url}
                      </a>
                    </td>

                    {/* Fuentes Detectadas */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {r.fuentesDetectadas.map((f, i) => (
                          <span
                            key={i}
                            className="bg-gray-200 dark:bg-gray-500 hover:bg-gray-50 dark:hover:bg-gray-400 px-3 py-1 rounded-full text-xs shadow-sm transition"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Latinotype */}
                    <td className="px-6 py-4">
                      {r.latinotype !== "Ninguna" ? (
                        <span className="bg-green-200 dark:bg-green-600 hover:bg-green-100 dark:hover:bg-green-500 text-green-800 dark:text-green-100 px-3 py-1 rounded-full text-xs font-medium shadow-sm transition">
                          {r.latinotype}
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-300 italic">
                          Ninguna
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 italic">
          © {new Date().getFullYear()} Latinotype Scanner
        </footer>
      </div>
    </div>
  );
}

export default App;
