"use client";
import { authClient } from "@/shared/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthTestDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  };

  if (isPending) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
        Loading session...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Temp Auth Dashboard</h1>

      {session ? (
        <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
          <h2 style={{ fontSize: 20, marginBottom: 15 }}>Session Active</h2>
          <div style={{ marginBottom: 20 }}>
            <p>
              <strong>Name:</strong> {session.user.name}
            </p>
            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
            <p>
              <strong>Username:</strong>{" "}
              {(session.user as typeof session.user & { username?: string }).username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#e00",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
          <p style={{ marginBottom: 15 }}>No session found.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Link
              href="/auth-test/login"
              style={{
                padding: "8px 16px",
                backgroundColor: "#333",
                color: "white",
                textDecoration: "none",
                borderRadius: 4,
              }}
            >
              To Login
            </Link>
            <Link
              href="/auth-test/register"
              style={{
                padding: "8px 16px",
                border: "1px solid #333",
                color: "#333",
                textDecoration: "none",
                borderRadius: 4,
              }}
            >
              To Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
