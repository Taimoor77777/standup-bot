import { useState, useEffect } from "react";
import StandupForm from "./components/StandupForm";
import SummaryCard from "./components/SummaryCard";
import HistoryFeed from "./components/HistoryFeed";
import { submitStandup, fetchHistory } from "./services/api";
import "./styles/App.css";

export default function App() {
  const [summary, setSummary]           = useState(null);
  const [loading, setLoading]           = useState(false);
  const [submitError, setSubmitError]   = useState(null);
  const [history, setHistory]           = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setHistoryLoading(true);
      const data = await fetchHistory();
      setHistory(data);
    } catch (err) {
      setHistoryError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleSubmit(formData) {
    setLoading(true);
    setSubmitError(null);
    setSummary(null);

    try {
      const result = await submitStandup(formData);
      setSummary(result.summary);
      // Refresh history so the new entry appears immediately
      await loadHistory();
      return true;
    } catch (err) {
      setSubmitError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Standup Bot</h1>
        <p>Turn messy updates into clean standups instantly.</p>
      </header>

      <main className="main">
        <section className="card">
          <StandupForm onSubmit={handleSubmit} loading={loading} />
          {submitError && <p className="error">⚠️ {submitError}</p>}
          {loading && <p className="muted">Thinking...</p>}
          <SummaryCard summary={summary} />
        </section>

        <section className="card">
          <HistoryFeed
            history={history}
            loading={historyLoading}
            error={historyError}
          />
        </section>
      </main>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import StandupForm from "./components/standup-form";
// import SummaryCard from "./components/summary-card";
// import HistoryFeed from "./components/history-feed";
// import { submitStandup, fetchHistory } from "./services/api";
// import { useState, useEffect } from "react";
// import StandupForm from "./components/StandupForm";
// import SummaryCard from "./components/SummaryCard";
// import HistoryFeed from "./components/HistoryFeed";
// import { submitStandup, fetchHistory } from "./services/api";

// const appStyles = {
//   app: {
//     minHeight: "100vh",
//     background: "linear-gradient(180deg, #f7fafc 0%, #eef6f9 100%)",
//     fontFamily:
//       "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
//   },

//   header: {
//     backgroundColor: "#ffffff",
//     borderBottom: "1px solid #e2e8f0",
//     padding: "2rem 1.5rem",
//     textAlign: "center",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
//   },

//   headerTitle: {
//     margin: "0 0 0.4rem",
//     fontSize: "2.1rem",
//     fontWeight: "700",
//     color: "#0f172a",
//     letterSpacing: "-0.4px",
//   },

//   headerSubtitle: {
//     margin: 0,
//     fontSize: "0.95rem",
//     color: "#64748b",
//   },

//   main: {
//     maxWidth: "1100px",
//     margin: "2.5rem auto",
//     padding: "0 1.25rem",
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "2rem",
//   },

//   section: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "1.25rem",
//   },

//   card: {
//     backgroundColor: "#ffffff",
//     borderRadius: "12px",
//     padding: "1.25rem",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
//     border: "1px solid #e2e8f0",
//   },

//   error: {
//     backgroundColor: "#fef2f2",
//     border: "1px solid #fecaca",
//     color: "#b91c1c",
//     padding: "0.9rem 1rem",
//     borderRadius: "8px",
//     fontSize: "0.85rem",
//   },

//   loading: {
//     color: "#64748b",
//     fontSize: "0.9rem",
//     padding: "0.5rem 0",
//   },

//   divider: {
//     height: "1px",
//     backgroundColor: "#e5e7eb",
//     margin: "0.5rem 0",
//   },

//   footerNote: {
//     textAlign: "center",
//     marginTop: "2rem",
//     fontSize: "0.75rem",
//     color: "#94a3b8",
//   },

//   // ✅ Responsive tweak
//   responsive: {
//     "@media (max-width: 900px)": {
//       gridTemplateColumns: "1fr",
//     },
//   },
// };

// export default function App() {
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [submitError, setSubmitError] = useState(null);

//   const [history, setHistory] = useState([]);
//   const [historyLoading, setHistoryLoading] = useState(true);
//   const [historyError, setHistoryError] = useState(null);

//   useEffect(() => {
//     loadHistory();
//   }, []);

//   async function loadHistory() {
//     try {
//       setHistoryLoading(true);
//       const data = await fetchHistory();
//       setHistory(data);
//     } catch (err) {
//       setHistoryError(err.message);
//     } finally {
//       setHistoryLoading(false);
//     }
//   }

//   async function handleSubmit(formData) {
//     setLoading(true);
//     setSubmitError(null);
//     setSummary(null);

//     try {
//       const result = await submitStandup(formData);
//       setSummary(result.summary);
//       await loadHistory();
//     } catch (err) {
//       setSubmitError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={appStyles.app}>
//       <header style={appStyles.header}>
//         <h1 style={appStyles.headerTitle}>Standup Bot</h1>
//         <p style={appStyles.headerSubtitle}>
//           Turn messy updates into clean standups instantly.
//         </p>
//       </header>

//       <main style={appStyles.main}>
//         {/* LEFT SIDE */}
//         <section style={appStyles.section}>
//           <div style={appStyles.card}>
//             <StandupForm onSubmit={handleSubmit} loading={loading} />

//             {submitError && (
//               <div style={appStyles.error}>⚠️ {submitError}</div>
//             )}

//             {loading && (
//               <div style={appStyles.loading}>🤖 Generating summary...</div>
//             )}
//           </div>

//           {summary && (
//             <div style={appStyles.card}>
//               <SummaryCard summary={summary} />
//             </div>
//           )}
//         </section>

//         {/* RIGHT SIDE */}
//         <section style={appStyles.section}>
//           <div style={appStyles.card}>
//             <HistoryFeed
//               history={history}
//               loading={historyLoading}
//               error={historyError}
//             />
//           </div>
//         </section>
//       </main>

//       <div style={appStyles.footerNote}>
//         Built with FastAPI + React + Groq 🚀
//       </div>
//     </div>
//   );
// }