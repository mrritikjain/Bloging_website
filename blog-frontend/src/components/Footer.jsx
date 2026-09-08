import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer" style={{ borderTop: "1px solid var(--border)", marginTop: "80px", padding: "40px 30px", background: "white" }}>
      <div style={{ maxWidth: "1250px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <div className="logo">
          <span className="logo-mark">B</span>
          <span>
            Blog<span className="logo-dot">.</span>
          </span>
        </div>
        <p style={{ color: "var(--muted)", fontSize: "14px" }}>
          &copy; {new Date().getFullYear()} Blog. All rights reserved. Stories that move you.
        </p>
        <div style={{ display: "flex", gap: "20px", fontSize: "14px", color: "var(--muted)" }}>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/create">Write</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
