"use client";

import Link from "next/link";
import { useBuildings } from "@/hooks/useBuildings";

export default function BuildingIndexPage() {
  const { buildings } = useBuildings();

  return (
    <div>
      <h1>All Buildings</h1>
      {buildings.map((b) => (
        <div key={b.id}>
          <Link href={`/building/${b.id}`}>
            {b.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
