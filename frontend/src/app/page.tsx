"use client";

import { useState } from "react";
import { UserDropdown } from "@/shared/components";

const mockUser = {
  name: "Sarus Yeen",
  handle: "@sarus",
  email: "sarus2549@gmail.com",
  image: null,
};

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white p-8">
      <p className="text-sm text-gray-500">
        Toggle state: currently {loggedIn ? "logged in" : "guest"}
      </p>
      <button
        onClick={() => setLoggedIn((v) => !v)}
        className="rounded-lg border px-4 py-2 text-sm"
      >
        Toggle login state
      </button>

      <UserDropdown
        user={loggedIn ? mockUser : null}
        onLogin={() => alert("Login clicked")}
        onRegister={() => alert("Register clicked")}
        onProfile={() => alert("Profile clicked")}
        onSettings={() => alert("Settings clicked")}
        onLogout={() => {
          alert("Logout clicked");
          setLoggedIn(false);
        }}
      />
    </div>
  );
}
