import { useState, useEffect } from "react";
import { signIn, signOut, onAuthChange } from "./auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // Listen for login state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  if (loading) return <div style={{ padding: 20, fontFamily: "sans-serif" }}>Loading...</div>;

  // If NOT logged in: Show simple login form
  if (!user) {
    return (
      <div style={{ padding: 20, fontFamily: "sans-serif" }}>
        <h2>RefurbTrac Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300 }}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ padding: 8 }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: 8 }}
          />
          <button type="submit" style={{ padding: 10, background: "#e8a020", border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
            Log In
          </button>
        </form>
      </div>
    );
  }

  // If logged in: Show placeholder with user email
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Welcome to RefurbTrac</h2>
      <p>Logged in as: <strong>{user.email}</strong></p>
      <button onClick={signOut} style={{ padding: "8px 16px", cursor: "pointer" }}>
        Log Out
      </button>
    </div>
  );
}