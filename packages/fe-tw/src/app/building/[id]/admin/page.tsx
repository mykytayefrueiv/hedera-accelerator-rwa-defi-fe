"use client";

import { DeployERC3643TokenForm } from "@/components/Forms/DeployERC3643TokenForm";
import { LoadingView } from "@/components/LoadingView";
import { useBuildings } from "@/hooks/useBuildings";
import React, { use, Usable } from "react";

type Props = {
  params: { id: string };
};

export default function AdminPage({ params }: Props) {
  const { id } = use<{ id: string }>(params as unknown as Usable<{ id: string }>);
  const { buildings } = useBuildings();

  const building = buildings.find(_building => _building.id === id);

  if (!buildings?.length || !id) {
    return <LoadingView isLoading />;
  } else if (!building) {
    return <p>Not found</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {building.title}: Admin
      </h1>
      <DeployERC3643TokenForm buildingAddress={building.address} />
    </div>
  );
}