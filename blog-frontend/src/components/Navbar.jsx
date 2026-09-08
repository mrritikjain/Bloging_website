import { Link, useNavigate } from "react-router-dom";
import { PenLine, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-mark">B</span>
          <span>
            Blog<span className="logo-dot">.</span>
          </span>
        </Link>

        <nav className="desktop-nav">
          <Link to="/">Home</Link>
          <a href="/#latest">Discover</a>
          <a href="/#latest">Latest</a>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/create" className="write-button">
                <PenLine size={17} />
                Write
              </Link>

              <Link to="/dashboard" className="profile-button">
                <User size={17} />
                {user.name}
              </Link>

              <button className="logout-button" onClick={handleLogout} title="Logout">
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">
                Login
              </Link>

              <Link to="/register" className="signup-button">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
