import { useState } from "react";

export default function StandupForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ yesterday: "", today: "", blockers: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = {};
    if (!form.yesterday.trim()) newErrors.yesterday = "Required";
    if (!form.today.trim()) newErrors.today = "Required";
    if (!form.blockers.trim()) newErrors.blockers = "Required (write 'None' if no blockers)";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const success = await onSubmit(form);

    if (success) {
      setForm({
        yesterday: "",
        today: "",
        blockers: "",
    });

    setErrors({});
  }
  }

  const fields = [
    { name: "yesterday", label: "✅ What did you do yesterday?", placeholder: "Finished the login page, fixed the nav bug..." },
    { name: "today", label: "🎯 What will you do today?", placeholder: "Start the dashboard component, review PRs..." },
    { name: "blockers", label: "🚧 Any blockers?", placeholder: "Waiting on API credentials... or: None" },
  ];

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {fields.map(({ name, label, placeholder }) => (
        <div key={name} style={styles.field}>
          <label style={styles.label}>{label}</label>
          <textarea
            name={name}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
            rows={3}
            style={{
              ...styles.textarea,
              borderColor: errors[name] ? "#dc2626" : "#cbd5e1",
              backgroundColor: errors[name] ? "#fef2f2" : "#f8fafc",
            }}
          />
          {errors[name] && <span style={styles.error}>{errors[name]}</span>}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        style={{
          ...styles.button,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "✨ Generating..." : "✨ Generate Summary"}
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "#0f172a",
    spacing: "0.3px",
  },
  textarea: {
    padding: "0.875rem",
    borderRadius: "8px",
    border: "1.5px solid #cbd5e1",
    fontSize: "0.95rem",
    resize: "vertical",
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.2s ease",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    lineHeight: 1.6,
  },
  error: {
    color: "#dc2626",
    fontSize: "0.8rem",
    fontWeight: 500,
  },
  button: {
    padding: "0.875rem 1.5rem",
    backgroundColor: "#0369a1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    transition: "all 0.2s ease",
    alignSelf: "flex-start",
  },
};