"use client";

import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";
import { buildingSlices } from "@/consts/slices";
import { slugify } from "@/utils/slugify";
import { SliceItem } from "./SliceItem";

export function SlicesOverview() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumbs with Back Arrow */}
      <nav className="flex items-center text-sm text-gray-700 mb-4">
        <Link href="/explorer" className="flex items-center text-purple-800 hover:underline">
          <ArrowBack fontSize="small" />
          <span className="ml-2">Explorer</span>
        </Link>
        {" / "}
        <span className="font-semibold">Slices</span>
      </nav>

      {/* Explanation Panel */}
      <div className="bg-purple-50 px-6 sm:px-8 md:px-10 py-6 rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">What Are Slices?</h1>
        <p className="text-sm sm:text-base text-gray-700 mb-4">
          Slices are smart contracts that help manage diversified allocations across
          assets. They rebalance portfolios periodically to match predefined
          allocations, making it easy for users to participate in DeFi strategies.
        </p>
      </div>

      {/* Slices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {buildingSlices.map((slice) => (
          <Link key={slice.name} href={`/slices/${slugify(slice.name)}`}>
            <div
              className="
                bg-white border border-gray-300 rounded-lg p-4 shadow-md
                transition-transform duration-200 hover:scale-[1.02] cursor-pointer
              "
            >
              <SliceItem slice={slice} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
