"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronDown, LogIn, LogOut, Settings, User, UserPlus } from "lucide-react";
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./dropdown-menu";
import { cn } from "@/shared/lib/utils";

export interface UserDropdownUser {
  name: string;
  handle?: string | null;
  email: string;
  image?: string | null;
}

export interface UserDropdownProps {
  user?: UserDropdownUser | null;
  onLogin?: () => void;
  onRegister?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  className?: string;
}

function UserAvatar({
  src,
  name,
  size = "md",
}: {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md";
}) {
  const dimension = size === "sm" ? 28 : 36;
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? "User avatar"}
        width={dimension}
        height={dimension}
        unoptimized
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary-navy font-semibold text-white",
        textSize
      )}
      style={{ width: dimension, height: dimension }}
    >
      {initial}
    </span>
  );
}

export function UserDropdown({
  user,
  onLogin,
  onRegister,
  onProfile,
  onSettings,
  onLogout,
  className,
}: UserDropdownProps) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-primary-navy outline-none",
          "transition-colors hover:bg-light-gray focus-visible:ring-2 focus-visible:ring-primary-red",
          className
        )}
      >
        {user ? (
          <UserAvatar src={user.image} name={user.name} size="sm" />
        ) : (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray">
            <User className="size-4 text-primary-navy" />
          </span>
        )}
        <span className="max-w-[100px] truncate">{user ? user.name : "บุคคลทั่วไป"}</span>
        <ChevronDown className="size-4 shrink-0 text-gray" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        {user ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2.5">
              <UserAvatar src={user.image} name={user.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-tight text-primary-navy">
                  {user.name}
                </p>
                {user.handle && <p className="mt-0.5 truncate text-xs text-gray">{user.handle}</p>}
                <p className="mt-0.5 truncate text-xs text-gray">{user.email}</p>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={onProfile}>
              <User />
              โปรไฟล์นิสิต
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onSettings}>
              <Settings />
              ตั้งค่าบัญชี
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={onLogout} destructive>
              <LogOut />
              ออกจากระบบ
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onSelect={onLogin}
              className="font-medium text-primary-red focus:text-primary-red"
            >
              <LogIn />
              เข้าสู่ระบบ (CUNet)
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onRegister}>
              <UserPlus />
              ลงทะเบียนใช้งาน
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
