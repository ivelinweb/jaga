// app/components/Header.tsx
"use client";

import { useState } from "react";

import { usePathname, useRouter } from "next/navigation";



export default function Header() {
  const [active, setActive] = useState("Dashboard");
  const router = useRouter();
  const pathname = usePathname(); // get current path

  return (
    <footer
      className="px-6 md:px-16 py-5 flex flex-col md:flex-row items-center justify-between w-full bottom-0 md:fixed z-50"
      style={{ background: "var(--background)" }}
    >
      {/* Left: Logo & Nav */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 mb-4 md:mb-0">
        <nav className="flex flex-col md:flex-row gap-2 md:gap-10 text-slate-500 transition-colors duration-100 ease-in text-sm md:text-base">
          <button className="hover:text-[var(--text)] cursor-pointer">
            Docs
          </button>
          <button className="hover:text-[var(--text)] cursor-pointer">
            Policies
          </button>
          <button className="hover:text-[var(--text)] cursor-pointer">
            Terms and Conditions
          </button>
          <button className="hover:text-[var(--text)] cursor-pointer">
            Support Center
          </button>
        </nav>
      </div>

      {/* Right: Socials & Copyright */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">

        <p className="text-slate-500 text-xs md:text-sm text-center md:text-right">
          © 2025 Jaga. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
