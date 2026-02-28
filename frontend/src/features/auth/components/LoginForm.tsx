"use client";

import React, { useState } from "react";
import { Loader2, Eye, EyeOff, GraduationCap, Mail, Lock } from "lucide-react";
import type { LoginFormProps } from "../types/types";

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert("เข้าสู่ระบบสำเร็จ!");
  };

  return (
    <div className="w-[450px] min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden relative flex flex-col justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
      <button type="button" className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
        ✕
      </button>

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 bg-[#8B0020] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8B0020]/20 mb-6">
          <GraduationCap size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ยินดีต้อนรับกลับมา</h1>
        <p className="text-gray-500 text-sm">เข้าสู่ระบบเพื่อเริ่มเรียนรู้วิชาการยุคใหม่</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">อีเมล</label>
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="example@student.chula.ac.th"
              className="w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl border-none focus:bg-white focus:ring-2 focus:ring-[#8B0020]/20 text-gray-900 placeholder:text-gray-400 text-sm outline-none"
            />
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className="text-xs font-bold text-gray-500">รหัสผ่าน</label>
            <a href="#" className="text-xs font-bold text-[#8B0020] hover:underline">
              ลืมรหัสผ่าน?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="ระบุรหัสผ่านของคุณ"
              className="w-full pl-10 pr-12 py-3.5 bg-gray-50 rounded-xl border-none focus:bg-white focus:ring-2 focus:ring-[#8B0020]/20 text-gray-900 placeholder:text-gray-400 text-sm outline-none"
            />
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#8B0020] hover:bg-[#6d0019] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-[#8B0020]/20 mt-4 flex justify-center items-center"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "เข้าสู่ระบบ"}
        </button>
      </form>

      <div className="relative flex py-6 items-center">
        <div className="flex-grow border-t border-gray-200" />
        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">ไม่มีบัญชีผู้ใช้งาน?</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      <button
        type="button"
        onClick={onSwitchToRegister}
        className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-6 rounded-xl text-sm"
      >
        สมัครสมาชิกใหม่
      </button>
    </div>
  );
}
