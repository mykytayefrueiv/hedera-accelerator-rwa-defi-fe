"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type BuildingNavigationProps = {
  id: string;
};

const BUILDING_NAV_ITEMS = [
  { name: "Overview", href: "" },
  { name: "Staking", href: "staking" },
  { name: "Proposals", href: "proposals" },
  { name: "Slices", href: "slices" },
  { name: "Payments", href: "payments" },
  { name: "Expenses", href: "expenses" },
  { name: "COPE", href: "cope" },
  { name: "Trade", href: "trade" },
];

export default function BuildingNavigation({ id }: BuildingNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-2 p-4">
      {BUILDING_NAV_ITEMS.map((item) => {
        const linkTo = `/building/${id}/${item.href}`;
        const isActive = pathname === linkTo || pathname === `${linkTo}/`;

        return (
          <Link
            key={item.name}
            href={linkTo}
            className={`block px-4 py-2 rounded-md text-base font-medium ${
              isActive
                ? "bg-gray-100 text-gray-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
