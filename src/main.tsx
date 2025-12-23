import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📚 Due Date Study</h1>
      <p>Your app is live and working!</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
