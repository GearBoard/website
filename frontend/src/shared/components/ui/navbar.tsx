"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-bg-white py-4 px-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-8 flex-1">
          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="font-bold tracking-tight text-primary-red flex flex-row items-center gap-2 text-base sm:text-3xl"
            >
              <Image
                src="/logo.svg"
                width={82}
                height={80}
                alt="GearBoard Logo"
                className="w-[42px] h-[41px] sm:w-[82px] sm:h-[80px]"
              />
              <span>GEARBOARD</span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex items-center bg-white shadow-[0_0_15px_rgba(0,0,0,0.05)] rounded-[10px] px-4 py-2.5 w-full max-w-[500px]">
            <Search className="w-5 h-5 text-primary-red mr-3" />
            <input
              type="text"
              placeholder="ค้นหาวิชา, อาจารย์ หรือข้อสอบ"
              aria-label="ค้นหา"
              className="bg-transparent outline-none w-full font-satoshi text-sm text-primary-navy placeholder:text-gray/60"
            />
          </div>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Button color="yellow" size="md" className="font-bold">
            Log in
          </Button>
          <Button color="red" size="md" className="font-bold">
            Sign up
          </Button>
        </div>

        {/* Mobile Icons (Search & Menu) */}
        <div className="md:hidden flex items-center gap-4">
          <button
            type="button"
            className="p-1 focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2 outline-none rounded-sm"
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-6 w-6 text-primary-red" />
          </button>
          <button
            type="button"
            className="p-1 focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2 outline-none rounded-sm"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6 text-primary-red" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Toggle */}
      {isSearchOpen && (
        <div className="md:hidden flex justify-center mt-[10px]">
          <div className="flex items-center bg-white shadow-[0_0_15px_rgba(0,0,0,0.05)] rounded-[10px] px-4 py-2.5 w-[374px] max-w-full">
            <Search className="w-5 h-5 text-primary-red mr-3" />
            <input
              type="text"
              placeholder="ค้นหาวิชา, อาจารย์ หรือข้อสอบ"
              aria-label="ค้นหา"
              className="bg-transparent outline-none w-full font-satoshi text-sm text-primary-navy placeholder:text-gray/60"
              autoFocus
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
