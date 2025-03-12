import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BACKEND_BASE_URL } from "../config";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    // Fetch user data on component mount
    useEffect(() => {
        fetch(`${BACKEND_BASE_URL}/auth/user`, {
            method: "GET",
            credentials: "include", // Send cookies in cross-origin requests
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched User Data:", data);
                if (data.displayName) setUser(data);
            })
            .catch((err) => {
                console.error("Error fetching user:", err);
                setUser(null);
            });
    }, []);

    // Google Login Handler
    const handleGoogleLogin = () => {
        window.location.href = `${BACKEND_BASE_URL}/auth/google`;
    };

    // Logout Handler
    const handleLogout = () => {
        fetch(`${BACKEND_BASE_URL}/auth/logout`, {
            method: "GET",
            credentials: "include", // Ensure cookies are sent
        })
            .then((res) => res.json())
            .then(() => {
                setUser(null); // Reset user state after logout
            })
            .catch((err) => console.error("Error logging out:", err));
    };

    return (
        <nav style={{ background: "#007BFF", padding: "10px", color: "white" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                maxWidth: "1200px",
                margin: "0 auto"
            }}>
                {/* Logo */}
                <Link
                    to="/"
                    style={{ fontSize: "20px", fontWeight: "bold", textDecoration: "none", color: "white" }}
                >
                    Recipe Finder
                </Link>

                {/* Desktop Menu */}
                <div style={{ display: "flex", gap: "20px" }} className="menu">
                    <Link
                        to="/"
                        style={{
                            textDecoration: "none",
                            color: location.pathname === "/" ? "#FFD700" : "white",
                            fontWeight: location.pathname === "/" ? "bold" : "normal"
                        }}
                    >
                        Home
                    </Link>
                    <Link
                        to="/saved"
                        style={{
                            textDecoration: "none",
                            color: location.pathname === "/saved" ? "#FFD700" : "white",
                            fontWeight: location.pathname === "/saved" ? "bold" : "normal"
                        }}
                    >
                        Saved Recipes
                    </Link>
                </div>

                {/* Auth Buttons */}
                {user ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>Welcome, {user.displayName}</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: "#ff4d4d",
                                color: "white",
                                padding: "6px 12px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleGoogleLogin}
                        style={{
                            background: "white",
                            color: "#007BFF",
                            padding: "6px 12px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Login with Google
                    </button>
                )}

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                        display: "none",
                        fontSize: "20px",
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer"
                    }}
                    className="menu-btn"
                >
                    ☰
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{ display: "flex", flexDirection: "column", background: "#0056b3", padding: "10px", marginTop: "10px" }} className="mobile-menu">
                    <Link
                        to="/"
                        style={{
                            textDecoration: "none",
                            color: location.pathname === "/" ? "#FFD700" : "white",
                            padding: "5px 0"
                        }}
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/saved"
                        style={{
                            textDecoration: "none",
                            color: location.pathname === "/saved" ? "#FFD700" : "white",
                            padding: "5px 0"
                        }}
                        onClick={() => setMenuOpen(false)}
                    >
                        Saved Recipes
                    </Link>
                    {user && (
                        <button
                            onClick={() => {
                                handleLogout();
                                setMenuOpen(false);
                            }}
                            style={{
                                background: "#ff4d4d",
                                color: "white",
                                padding: "6px 12px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                marginTop: "5px"
                            }}
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
