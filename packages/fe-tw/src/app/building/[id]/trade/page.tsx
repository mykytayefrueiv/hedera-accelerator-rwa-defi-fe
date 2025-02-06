"use client";

import { LoadingView } from "@/components/LoadingView";
import TradeView from "@/components/Trade/TradeView";
import { useBuildings } from "@/hooks/useBuildings";
import React, { use, Usable } from "react";
import { PageHeader } from "@/components/Page/PageHeader";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";

type Props = {
  params: { id: string };
};

export default function BuildingTradePage({ params }: Props) {
  const { id } = use<{ id: string }>(params as unknown as Usable<{ id: string }>);
  const { buildings } = useBuildings();
  const { data: evmAddress } = useEvmAddress();

  if (!evmAddress) {
    return <p>This page available only for authorized users</p>
  }

  const building = buildings.find(_building => _building.id === id);

  if (!buildings?.length || !id) {
    return <LoadingView isLoading />;
  } else if (!building) {
    return <p>Not found</p>;
  }

  return (
    <div className="p-4 flex flex-col gap-10">
      <PageHeader title={`${building?.title}: Trade`} />
      <TradeView building={building} />
    </div>
  );
}
