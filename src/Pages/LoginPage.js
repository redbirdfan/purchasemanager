import React, { useCallback, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../UserContext";
import Cookies from "js-cookie";

function LoginPage() {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  console.log("Launching login page");

  const checkUser = useCallback(async (e) => {
    e.preventDefault();
    setErr("");

    if (!username || !password) {
      setErr("Username and Password required");
      console.log("no username or password");
      return;
    } else {
      try {
        const response = await fetch("/loginPage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log("Login data from backend: ", data);

        if (response.ok && data.firstName && data.lastName && data.username) {
          console.log("Login successful, user data received:", data);
          const token = data.token; 
          Cookies.set("authToken", token, { path: "/", expires: 2 });

          setUser({
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
          });
        
          navigate("/hub");
          console.log("Backend connection successful, user context updated.");
        } else if (response.ok) {
          
          setErr("Login successful, but missing user information from the server.");
          console.error("Missing firstName, lastName, or Username in login response:", data);
          navigate("/hub"); 
        } else {
          setErr(data.message || "Login failed. Invalid username or password.");
          console.log("Login failed:", data);
        }
      } catch (error) {
        setErr("An unexpected error occurred during login.");
        console.error("ERROR:", error);
      }
    }
  }, [username, password, navigate, setUser]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <header>Welcome to Purchase Manager</header>
        <h1>Please login below</h1>
        <form onSubmit={checkUser}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        {err && <p style={{ color: "red" }}>{err}</p>}
      </div>
    </>
  );
}

export default LoginPage;