// // Displays the AI-generated summary after form submission.
// export default function SummaryCard({ summary }) {
//   if (!summary) return null;

//   return (
//     <div style={styles.card}>
//       <h2 style={styles.title}>🤖 AI Summary</h2>
//       <pre style={styles.text}>{summary}</pre>
//     </div>
//   );
// }

// const styles = {
//   card: {
//     backgroundColor: "#f0fdf4",
//     border: "1.5px solid #86efac",
//     borderRadius: "10px",
//     padding: "1.25rem 1.5rem",
//   },
//   title: { margin: "0 0 0.75rem", fontSize: "1rem", color: "#15803d" },
//   text: {
//     margin: 0,
//     whiteSpace: "pre-wrap",
//     fontFamily: "inherit",
//     fontSize: "0.95rem",
//     color: "#1f2937",
//     lineHeight: 1.7,
//   },
// };
// Displays the AI-generated summary after form submission with cleaned markdown formatting.
// Displays the AI-generated summary after form submission with cleaned markdown formatting.
// Displays the AI-generated summary after form submission with cleaned markdown formatting.
export default function SummaryCard({ summary }) {
  if (!summary) return null;

  const parseContent = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let currentList = [];

    const flushList = (key) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={key} style={styles.list}>
            {currentList.map((item, i) => (
              <li key={i} style={{ marginBottom: '0.5rem', color: '#374151' }}>
                {item}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed === '---' || trimmed === '...') return;

      // ✅ Detect pure headers (**Header**)
      const headerMatch = trimmed.match(/^\*\*(.+?)\*\*$/);
      if (headerMatch) {
        flushList(`list-${idx}`);

        elements.push(
          <h3 key={`header-${idx}`} style={styles.sectionHeader}>
            {headerMatch[1].trim()}
          </h3>
        );
        return;
      }

      // ✅ Detect bullet points
      const bulletMatch = trimmed.match(/^(\s*)\*\s+(.+)$/);
      if (bulletMatch) {
        let bulletText = bulletMatch[2].trim();

        // 🔥 FIX: Handle "* **Header**" case
        const headerInsideBullet = bulletText.match(/^\*\*(.+?)\*\*$/);
        if (headerInsideBullet) {
          flushList(`list-${idx}`);

          elements.push(
            <h3 key={`header-${idx}`} style={styles.sectionHeader}>
              {headerInsideBullet[1].trim()}
            </h3>
          );
          return;
        }

        // Clean bullet text
        bulletText = bulletText
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .trim();

        currentList.push(bulletText);
        return;
      }

      // ✅ Regular paragraph
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

    // Final flush
    flushList('list-final');

    return elements;
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>AI Summary</h2>
      <div style={styles.content}>
        {parseContent(summary)}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#f0fdf4",
    border: "1.5px solid #86efac",
    borderRadius: "10px",
    padding: "1.25rem 1.5rem",
  },
  title: {
    margin: "0 0 1rem",
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#15803d",
  },
  content: {
    margin: 0,
  },
  sectionHeader: {
    margin: "1rem 0 0.75rem",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#059669",
  },
  paragraph: {
    margin: "0.75rem 0",
    fontSize: "0.95rem",
    color: "#374151",
    lineHeight: 1.6,
  },
  list: {
    margin: "0.75rem 0",
    paddingLeft: "1.5rem",
    listStyle: "disc",
  },
};