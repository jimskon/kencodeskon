import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    window.location.href = "https://moodle.kenyon.edu/my/courses.php"; // Redirect to SAML login
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ECE7F2",
        position: "relative",
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          fontSize: "12px",
          color: "#5E2A84",
          opacity: "0.6",
        }}
      >
        IDE for Kenyon Computing
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
          width: "360px",
          border: "1px solid #D1C4E9",
        }}
      >
        <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "#4B0082" }}>
          Sign in
        </h1>
        <p style={{ color: "#666", marginTop: "10px", fontSize: "14px" }}>
          Use your Kenyon College account to continue
        </p>

        <button
          onClick={handleLogin}
          style={{
            marginTop: "20px",
            width: "100%",
            backgroundColor: "#5E2A84", // Kenyon Purple Pantone 267 U
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s ease-in-out",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#4B1E69")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#5E2A84")}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Kenyon"}
        </button>
      </div>
    </div>
  );
}
