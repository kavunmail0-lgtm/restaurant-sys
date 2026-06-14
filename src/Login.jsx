import { useState } from "react";

function Login() {
  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const passwords = {
      admin: "admin123",
      kitchen: "kitchen123",
      waiter: "waiter123",
      cashier: "cashier123",
    };

    if (password === passwords[role]) {
      localStorage.setItem("role", role);
      window.location.href = `/${role}`;
    } else {
      alert("Wrong Password");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "400px", margin: "auto" }}>
      <h1>🔐 Login</h1>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      >
        <option value="admin">Admin</option>
        <option value="kitchen">Kitchen</option>
        <option value="waiter">Waiter</option>
        <option value="cashier">Cashier</option>
      </select>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "12px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;