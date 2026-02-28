'use client';

import React, { useState } from 'react';
// ตรวจสอบชื่อไฟล์ให้ตรงกับที่คุณตั้ง (เช่น RegistrationForm หรือ Register)
import RegistrationForm from './Register';
import LoginForm from './Login';

export default function Home() {
  // สร้างตัวแปรเก็บสถานะ: จะเป็น 'register' หรือ 'login'
  const [currentView, setCurrentView] = useState<'register' | 'login'>('register');

  return (
    <div className="min-h-screen bg-black/50 flex items-center justify-center p-4 font-sans backdrop-blur-sm">

      {/* ถ้าสถานะเป็น 'login' ให้โชว์หน้า Login */}
      {currentView === 'login' ? (
        <LoginForm onSwitchToRegister={() => setCurrentView('register')} />
      ) : (

        /* ถ้าไม่ใช่ (คือเป็น 'register') ให้โชว์หน้า Register */
        <RegistrationForm onSwitchToLogin={() => setCurrentView('login')} />
      )}

    </div>
  );
}