import { useState } from "react";
import API from "../services/api";

function CityAI() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await API.post("/ai/ask", { question });
      setResponse(res.data.answer);
    } catch (err) {
      setResponse("⚠️ Could not reach the assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAsk();
  };

  return (
    <>
      {/* Floating Button — fixed to viewport, always visible regardless of scroll */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-full shadow-xl font-bold z-[9999]"
      >
        🤖 City AI
      </button>

      {/* Chat Window — also fixed, sits ABOVE everything (z-[60]) so it never
          gets visually trapped behind other dashboard cards */}
      {open && (
        <div className="fixed bottom-24 right-6 w-[380px] max-h-[70vh] overflow-y-auto bg-slate-800 rounded-2xl shadow-2xl p-5 z-[9999] border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Smart City AI Assistant</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about traffic, AQI, energy..."
            className="w-full p-3 rounded-lg bg-slate-700 outline-none mb-3 text-white"
          />

          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg text-white disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>

          {response && (
            <div className="mt-4 bg-slate-700 p-3 rounded-lg text-white text-sm">
              {response}
            </div>
          )}

          <p className="text-slate-500 text-xs mt-3">
            Try: "What's the current AQI?" or "Any active alerts?"
          </p>
        </div>
      )}
    </>
  );
}

export default CityAI;