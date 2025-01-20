"use client";

import React, { use, Usable } from "react";
import TradeView from "@/components/Trade/TradeView";
import { useBuildings } from "@/hooks/useBuildings";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default function TradePage({ params }: Props) {
  const { id } = use<{ id: string }>(params as unknown as Usable<{ id: string }>);
  const { buildings } = useBuildings();
  const building = buildings.find((b) => b.id === id);

  if (!id || !buildings?.length) {
    return null;
  } else if (!building) {
    notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {building?.title}: Trade
      </h1>
      <TradeView />
    </div>
  );
}
