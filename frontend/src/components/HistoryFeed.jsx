// // Displays the last 20 standup summaries fetched from Supabase.
// export default function HistoryFeed({ history, loading, error }) {
//   if (loading) return <p style={styles.muted}>Loading history...</p>;
//   if (error)   return <p style={styles.error}>⚠️ {error}</p>;
//   if (!history || history.length === 0)
//     return <p style={styles.muted}>No standups yet. Submit your first one above!</p>;

//   return (
//     <div style={styles.feed}>
//       <h2 style={styles.title}>📋 History</h2>
//       {history.map((item) => (
//         <div key={item.id} style={styles.card}>
//           <span style={styles.date}>
//             {new Date(item.created_at).toLocaleString()}
//           </span>
//           <pre style={styles.text}>{item.summary}</pre>
//         </div>
//       ))}
//     </div>
//   );
// }

// const styles = {
//   feed:  { display: "flex", flexDirection: "column", gap: "0.875rem" },
//   title: { margin: "0 0 0.5rem", fontSize: "1rem", color: "#374151" },
//   card: {
//     backgroundColor: "#f9fafb",
//     border: "1px solid #e5e7eb",
//     borderRadius: "8px",
//     padding: "1rem 1.25rem",
//   },
//   date:  { fontSize: "0.75rem", color: "#9ca3af", display: "block", marginBottom: "0.5rem" },
//   text: {
//     margin: 0,
//     whiteSpace: "pre-wrap",
//     fontFamily: "inherit",
//     fontSize: "0.875rem",
//     color: "#374151",
//     lineHeight: 1.6,
//   },
//   muted: { color: "#9ca3af", fontSize: "0.9rem" },
//   error: { color: "#ef4444", fontSize: "0.9rem" },
// };

// Displays the last 20 standup summaries fetched from Supabase with cleaned formatting.
// Displays the last 20 standup summaries with markdown parsing (aligned with backend)

export default function HistoryFeed({ history, loading, error }) {
  if (loading) return <p style={styles.muted}>Loading history...</p>;
  if (error) return <p style={styles.error}>⚠️ {error}</p>;
  if (!history || history.length === 0)
    return <p style={styles.muted}>No standups yet. Submit your first one above!</p>;

  const parseSummary = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let currentList = [];

    const flushList = (key) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={key} style={styles.bulletList}>
            {currentList.map((item, i) => (
              <li key={i} style={styles.bulletItem}>{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) return;

      // ✅ Handle headers like **Yesterday**
      const headerMatch = trimmed.match(/^\*\*(.+?)\*\*$/);
      if (headerMatch) {
        flushList(`list-${idx}`);

        elements.push(
          <h4 key={`header-${idx}`} style={styles.sectionHeader}>
            {headerMatch[1]}
          </h4>
        );
        return;
      }

      // ✅ Handle bullet points (* something)
      const bulletMatch = trimmed.match(/^\*\s+(.+)$/);
      if (bulletMatch) {
        const cleanText = bulletMatch[1]
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .trim();

        currentList.push(cleanText);
        return;
      }

      // ✅ Handle paragraph (Summary text)
      flushList(`list-${idx}`);

      const cleanText = trimmed
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1');

      elements.push(
        <p key={`para-${idx}`} style={styles.paragraph}>
          {cleanText}
        </p>
      );
    });

    flushList("list-final");

    return elements;
  };

  return (
    <div style={styles.feed}>
      <h2 style={styles.title}>📋 History</h2>

      {history.map((item) => (
        <div key={item.id} style={styles.card}>
          <span style={styles.date}>
            {new Date(item.created_at).toLocaleString()}
          </span>

          <div style={styles.summaryContent}>
            {parseSummary(item.summary)}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  feed: {
    display: "flex",
    flexDirection: "column",
    gap: "0.875rem",
  },
  title: {
    margin: "0 0 1rem",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#374151",
  },
  card: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "1rem 1.25rem",
  },
  date: {
    fontSize: "0.75rem",
    color: "#9ca3af",
    display: "block",
    marginBottom: "0.75rem",
  },
  summaryContent: {
    fontSize: "0.875rem",
    color: "#374151",
    lineHeight: 1.6,
  },
  sectionHeader: {
    margin: "0.75rem 0 0.4rem",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#059669",
  },
  bulletList: {
    margin: "0.4rem 0",
    paddingLeft: "1.5rem",
    listStyle: "disc",
  },
  bulletItem: {
    marginBottom: "0.25rem",
  },
  paragraph: {
    margin: "0.5rem 0",
  },
  muted: {
    color: "#9ca3af",
    fontSize: "0.9rem",
  },
  error: {
    color: "#ef4444",
    fontSize: "0.9rem",
  },
};