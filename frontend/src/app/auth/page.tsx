"use client";

import { LoginForm, RegistrationForm } from "@/features/auth";
import { useState } from "react";

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<"register" | "login">("register");

  return (
    <div className="min-h-screen bg-black/50 flex items-center justify-center p-4 font-sans backdrop-blur-sm">
      {currentView === "login" ? (
        <LoginForm onSwitchToRegister={() => setCurrentView("register")} />
      ) : (
        <RegistrationForm onSwitchToLogin={() => setCurrentView("login")} />
      )}
    </div>
  );
}
