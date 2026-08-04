"use client";

import { ProfileForm } from "@/features/auth";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="relative z-0 flex min-h-screen items-center justify-center overflow-hidden bg-primary-red p-4 font-sans">
      <Image
        src="/auth-bg-gears.svg"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="pointer-events-none -z-10 hidden object-cover md:block"
      />

      <button
        type="button"
        onClick={() => router.push("/auth")}
        aria-label="กลับสู่หน้าแรก"
        className="absolute left-12 top-12 z-10 hidden h-[38px] w-[46px] cursor-pointer items-center justify-center rounded-lg bg-white text-primary-red md:flex"
      >
        <ArrowLeft aria-hidden="true" />
      </button>

      <ProfileForm />
    </div>
  );
}
