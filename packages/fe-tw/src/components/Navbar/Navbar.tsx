"use client";

import { useState } from "react";
import Link from "next/link";
import { WalletConnectModal } from "@/components/Wallets/WalletConnectModal";
import { NavbarUserActionsMenu } from "@/components/Navbar/NavbarUserActionsMenu";

const SITE_LINKS = [
  { title: "Explorer", url: "/explorer" },
  { title: "About", url: "/landing" },
  { title: "Admin", url: "/admin" },
];

export function Navbar({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="navbar bg-accent w-full px-4 py-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex-none">
            <Link
              href="/"
              className="text-lg font-bold text-gray-700 hover:text-gray-900"
            >
              BUILDINGS "R" US
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-square btn-ghost"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6 pr-4">
            {SITE_LINKS.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="uppercase font-bold text-sm text-gray-700 hover:text-gray-900"
              >
                {link.title}
              </Link>
            ))}
            <NavbarUserActionsMenu />
            <WalletConnectModal />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-2 px-4 space-y-4">
          <div className="flex flex-col gap-3">
            {SITE_LINKS.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="text-gray-700 hover:text-gray-900"
              >
                {link.title}
              </Link>
            ))}
            <NavbarUserActionsMenu />
            <WalletConnectModal />
          </div>
        </div>
      )}

      <main className="flex-1 bg-base-100 w-full">{children}</main>
    </div>
  );
}
