import { useState } from "react";

// The 3 textarea form. Handles its own input state and validation.
// Calls onSubmit(data) — parent decides what to do with it.
export default function StandupForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ yesterday: "", today: "", blockers: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on type
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = {};
    if (!form.yesterday.trim()) newErrors.yesterday = "Required";
    if (!form.today.trim()) newErrors.today = "Required";
    if (!form.blockers.trim()) newErrors.blockers = "Required (write 'None' if no blockers)";
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(form);
  }

  const fields = [
    { name: "yesterday", label: "✅ What did you do yesterday?", placeholder: "Finished the login page, fixed the nav bug..." },
    { name: "today",     label: "🎯 What will you do today?",    placeholder: "Start the dashboard component, review PRs..." },
    { name: "blockers",  label: "🚧 Any blockers?",              placeholder: "Waiting on API credentials... or: None" },
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
              borderColor: errors[name] ? "#ef4444" : "#d1d5db",
            }}
          />
          {errors[name] && <span style={styles.error}>{errors[name]}</span>}
        </div>
      ))}

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Generating..." : "✨ Generate Summary"}
      </button>
    </form>
  );
}

const styles = {
  form:     { display: "flex", flexDirection: "column", gap: "1.25rem" },
  field:    { display: "flex", flexDirection: "column", gap: "0.375rem" },
  label:    { fontWeight: 600, fontSize: "0.95rem", color: "#374151" },
  textarea: {
    padding: "0.625rem",
    borderRadius: "8px",
    border: "1.5px solid #d1d5db",
    fontSize: "0.9rem",
    resize: "vertical",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.15s",
  },
  error:    { color: "#ef4444", fontSize: "0.8rem" },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    opacity: 1,
    transition: "opacity 0.15s",
    alignSelf: "flex-start",
  },
};


// import { useState } from "react";

// // The 3 textarea form. Handles its own input state and validation.
// // Calls onSubmit(data) — parent decides what to do with it.
// export default function StandupForm({ onSubmit, loading }) {
//   const [form, setForm] = useState({ yesterday: "", today: "", blockers: "" });
//   const [errors, setErrors] = useState({});

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     // Clear error on type
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   }

//   function validate() {
//     const newErrors = {};
//     if (!form.yesterday.trim()) newErrors.yesterday = "Required";
//     if (!form.today.trim()) newErrors.today = "Required";
//     if (!form.blockers.trim()) newErrors.blockers = "Required (write 'None' if no blockers)";
//     return newErrors;
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     onSubmit(form);
//   }

//   const fields = [
//     { name: "yesterday", label: "Yesterday", placeholder: "Finished the login page, fixed the nav bug..." },
//     { name: "today",     label: "Today",     placeholder: "Start the dashboard component, review PRs..." },
//     { name: "blockers",  label: "Blockers",  placeholder: "Waiting on API credentials... or: None" },
//   ];

//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleSubmit} style={styles.form}>
//         {fields.map(({ name, label, placeholder }) => (
//           <div key={name} style={styles.field}>
//             <label style={styles.label}>
//               <span style={styles.labelText}>{label}</span>
//             </label>
//             <textarea
//               name={name}
//               value={form[name]}
//               onChange={handleChange}
//               placeholder={placeholder}
//               rows={5}
//               style={{
//                 ...styles.textarea,
//                 borderColor: errors[name] ? "#ef4444" : "#cbd5e1",
//                 backgroundColor: errors[name] ? "#fef2f2" : "#f8fafc",
//               }}
//             />
//             {errors[name] && <span style={styles.error}>{errors[name]}</span>}
//           </div>
//         ))}

//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             ...styles.button,
//             opacity: loading ? 0.7 : 1,
//             cursor: loading ? "not-allowed" : "pointer",
//           }}
//         >
//           {loading ? "Generating..." : "Generate Summary"}
//         </button>
//       </form>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     backgroundColor: "#ffffff",
//     border: "1px solid #e2e8f0",
//     borderRadius: "12px",
//     padding: "2rem",
//     boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "2rem",
//   },
//   field: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "0.75rem",
//   },
//   label: {
//     display: "flex",
//   labelText: {
//     fontWeight: 600,
//     fontSize: "0.95rem",
//     color: "#475569",
//     textTransform: "capitalize",
//   },
//   textarea: {
//     padding: "1rem",
//     borderRadius: "8px",
//     border: "1.5px solid #cbd5e1",
//     fontSize: "0.95rem",
//     resize: "vertical",
//     fontFamily: "inherit",
//     outline: "none",
//     transition: "all 0.2s ease",
//     backgroundColor: "#f8fafc",
//     color: "#334155",
//     lineHeight: 1.6,
//   },
//   error: {
//     color: "#dc2626",
//     fontSize: "0.8rem",
//     fontWeight: 500,
//   },
//   button: {
//     padding: "0.875rem 1.75rem",
//     backgroundColor: "#0f766e",
//     color: "#ffffff",
//     border: "none",
//     borderRadius: "8px",
//     fontSize: "1rem",
//   },
// }
// };