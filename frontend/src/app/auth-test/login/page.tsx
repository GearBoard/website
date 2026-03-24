"use client";
import { useState } from "react";
import { authClient } from "@/shared/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginTestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: () => {
          router.push("/auth-test");
        },
        onError: (ctx: { error: { message: string } }) => {
          setError(ctx.error.message);
        },
      }
    );
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Temp Login</h1>
      {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div>
          <label style={{ display: "block", marginBottom: 5 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 5 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 15px",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
      <p style={{ marginTop: 15 }}>
        <Link href="/auth-test/register" style={{ color: "#0070f3" }}>
          Go to Register
        </Link>
      </p>
    </div>
  );
}
