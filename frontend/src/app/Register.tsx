'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { Camera, Loader2, ChevronDown, Eye, EyeOff, Check, GraduationCap, Mail } from 'lucide-react';

interface ProfileFormData {
    fullName: string;
    email: string;
    department: string;
    password: string;
    profileImage: string | null;
}

const DEPARTMENTS = [
    'Chemical Engineering',
    'Civil Engineering',
    'Computer Engineering',
    'Electrical Engineering',
    'Environmental and Sustainable Engineering',
    'Industrial Engineering',
    'Mechanical Engineering',
    'Metallurgical Engineering',
    'Mining and Petroleum Engineering',
    'Nuclear Engineering',
    'Survey Engineering',
    'Water Resource Engineering',
    'International School of Engineering (ISE)'
];

interface RegistrationFormProps {
    onSwitchToLogin: () => void;
}

export default function RegistrationForm({ onSwitchToLogin }: RegistrationFormProps) {
    const [formData, setFormData] = useState<ProfileFormData>({
        fullName: '',
        email: '',
        department: '',
        password: '',
        profileImage: null,
    });

    const [emailError, setEmailError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === 'email') setEmailError('');
    };

    const validateEmail = (email: string) => {
        if (!email) {
            setEmailError('');
            return true;
        }
        if (!email.endsWith('@student.chula.ac.th')) {
            setEmailError('กรุณาใช้อีเมลนิสิตจุฬาฯ (@student.chula.ac.th) เท่านั้น');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleSelectDepartment = (dept: string) => {
        setFormData((prev) => ({ ...prev, department: dept }));
        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(formData.email)) return;

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('Registration data:', formData);
        setIsLoading(false);
        alert('สร้างบัญชีสำเร็จ!');
    };

    return (
        // 1. เพิ่ม overflow-y-auto ที่ตรงนี้แทน (เพื่อให้ scroll หน้าจอหลักได้ถ้าจอมือถือเล็ก)
        <div className="min-h-screen bg-black/50 flex items-center justify-center p-4 py-10 font-sans backdrop-blur-sm overflow-y-auto">
            
            {/* 2. เอา fixed height ออก (h-[600px]) เปลี่ยนเป็น auto และเอา overflow-hidden ออก */}
            <div className="w-[450px] bg-white rounded-3xl shadow-2xl relative p-8 pt-10">

                <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors">✕</button>

                <div className="text-left mb-6">
                    <button onClick={onSwitchToLogin} className="text-gray-400 text-sm mb-4 flex items-center hover:text-gray-600">&lt; กลับสู่หน้าหลัก</button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">สร้างบัญชีใหม่</h1>
                    <p className="text-gray-500 text-sm">เข้าร่วมชุมชนการเรียนรู้ทางวิศวกรรมกับเรา</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* รูปโปรไฟล์ */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group">
                            <div onClick={handleImageClick} className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all">
                                {formData.profileImage ? <img src={formData.profileImage} alt="Profile preview" className="w-full h-full object-cover" /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}
                            </div>
                            <button type="button" onClick={handleImageClick} className="absolute bottom-0 right-0 bg-[#8B0020] hover:bg-[#A00025] text-white p-2 rounded-full border-2 border-white shadow-md transition-colors"><Camera size={14} /></button>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>

                    {/* ชื่อ */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">ชื่อ-นามสกุล</label>
                        <div className="relative">
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="กรอกชื่อและนามสกุลของคุณ" className="w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl border-none focus:bg-white focus:ring-2 focus:ring-[#8B0020]/20 text-gray-900 placeholder:text-gray-400 text-sm transition-all outline-none" />
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                    </div>

                    {/* อีเมล */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">อีเมล</label>
                        <div className="relative">
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={(e) => validateEmail(e.target.value)} required placeholder="example@student.chula.ac.th" className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl border-none focus:bg-white focus:ring-2 text-gray-900 placeholder:text-gray-400 text-sm transition-all outline-none ${emailError ? 'ring-2 ring-red-500 focus:ring-red-500 bg-red-50' : 'focus:ring-[#8B0020]/20'}`} />
                            <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 ${emailError ? 'text-red-400' : 'text-gray-400'}`} />
                        </div>
                        {emailError && <p className="text-red-500 text-xs mt-1.5 ml-1 animate-pulse">* {emailError}</p>}
                    </div>

                    {/* สาขา */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">สาขาวิชา (ภาควิชา)</label>
                        <div className="relative">
                            <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`w-full pl-10 pr-10 py-3.5 text-left rounded-xl transition-all outline-none flex items-center justify-between ${isDropdownOpen ? 'bg-white ring-2 ring-[#8B0020]/20' : 'bg-gray-50 hover:bg-gray-100'}`}><span className={`text-sm ${formData.department ? 'text-gray-900' : 'text-gray-400'}`}>{formData.department || 'เลือกสาขาวิชาของคุณ'}</span><ChevronDown className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} size={20} /></button>
                            <GraduationCap className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            {isDropdownOpen && (
                                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                        {DEPARTMENTS.map((dept) => (
                                            <div key={dept} onClick={() => handleSelectDepartment(dept)} className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between ${formData.department === dept ? 'bg-[#8B0020]/5 text-[#8B0020] font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-[#8B0020]'}`}>{dept}{formData.department === dept && <Check size={16} />}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* รหัสผ่าน */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">รหัสผ่าน</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} required placeholder="ระบุรหัสผ่านของคุณ" className="w-full pl-10 pr-12 py-3.5 bg-gray-50 rounded-xl border-none focus:bg-white focus:ring-2 focus:ring-[#8B0020]/20 text-gray-900 placeholder:text-gray-400 text-sm transition-all outline-none" />
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-[#8B0020] hover:bg-[#6d0019] disabled:bg-gray-300 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-[#8B0020]/20 mt-6">{isLoading ? <><Loader2 className="animate-spin mr-2" size={20} />กำลังลงทะเบียน...</> : 'สร้างบัญชีผู้ใช้งาน'}</button>
                </form>

                <div className="mt-6 text-center">
                    <span className="text-gray-500 text-sm">มีบัญชีอยู่แล้ว? </span>
                    <button type="button" onClick={onSwitchToLogin} className="text-[#8B0020] font-bold text-sm hover:underline">เข้าสู่ระบบ</button>
                </div>
            </div>
        </div>
    );
}