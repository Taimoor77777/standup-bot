// All API calls live here. If the backend URL changes, change it in one place.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:10000";

/**
 * Send standup to the backend, get back an AI summary.
 * @param {{ yesterday: string, today: string, blockers: string }} data
 * @returns {Promise<{ summary: string, id: string }>}
 */
export async function submitStandup(data) {
  const res = await fetch(`${BASE_URL}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Server error: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch the last 20 standup summaries from history.
 * @returns {Promise<Array>}
 */
export async function fetchHistory() {
  const res = await fetch(`${BASE_URL}/history`);

  if (!res.ok) {
    throw new Error(`Failed to load history: ${res.status}`);
  }

  const data = await res.json();
  return data.standups;
}
