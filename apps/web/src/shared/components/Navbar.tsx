"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu } from "lucide-react";
import GithubIcon from "@/shared/components/icons/GithubIcon";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useDebouncedValue } from "@/shared/hooks";
import { useSearch } from "@/shared/contexts/SearchContext";

interface NavbarProps {
  isAuthenticated?: boolean;
  onMenuClick?: () => void;
}

export const Navbar = ({ isAuthenticated = false, onMenuClick }: NavbarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const { setSearch } = useSearch();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebouncedValue(searchInput, 350);

  useEffect(() => {
    setSearch(debouncedSearchInput.trim());
  }, [debouncedSearchInput, setSearch]);

  return (
    <nav className="bg-white border-b border-gray">
      <div className="flex items-center justify-between px-6 h-12 md:px-16 md:h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-[9px] md:gap-3 shrink-0">
          <Image
            src="/logo.svg"
            width={47}
            height={46}
            alt="GearBoard Logo"
            className="w-8 h-[31px] md:w-[47px] md:h-[46px]"
          />
          <span className="font-black text-base md:text-2xl text-primary-red">gearboard</span>
        </Link>

        {/* Search Bar — desktop only, fills space between logo and actions */}
        <div className="hidden md:flex flex-1 justify-center mx-8">
          <div className="w-full max-w-[478px]">
            <Input
              type="search"
              placeholder="ค้นหา"
              aria-label="ค้นหา"
              icon={<Search />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center shrink-0">
          {/* Desktop: authenticated */}
          {isAuthenticated && (
            <div className="hidden md:flex">
              <Button
                variant="outline"
                color="gray"
                size="md"
                iconLeft={<GithubIcon />}
                onClick={() =>
                  window.open(process.env.NEXT_PUBLIC_GITHUB_URL, "_blank", "noopener,noreferrer")
                }
              >
                gearboard
              </Button>
            </div>
          )}

          {/* Desktop: unauthenticated */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-[15px]">
              <Button
                variant="outline"
                color="red"
                size="md"
                className="font-bold"
                onClick={() => router.push("/auth/login")}
              >
                เข้าสู่ระบบ
              </Button>
              <Button
                color="red"
                size="md"
                className="font-bold"
                onClick={() => router.push("/auth/register")}
              >
                ลงทะเบียน
              </Button>
            </div>
          )}

          {/* Mobile icons */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              type="button"
              className="p-1 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2"
              aria-label="Search"
              aria-expanded={isSearchOpen}
              aria-controls="mobile-search-bar"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-6 h-6 text-primary-red" />
            </button>
            <button
              type="button"
              className="p-1 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2"
              aria-label="Menu"
              onClick={onMenuClick}
            >
              <Menu className="w-6 h-6 text-primary-red" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search bar — expands below navbar on search icon click */}
      {isSearchOpen && (
        <div id="mobile-search-bar" className="md:hidden px-6 pb-[10px]">
          <Input
            type="search"
            placeholder="ค้นหา"
            aria-label="ค้นหา"
            icon={<Search />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoFocus
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
