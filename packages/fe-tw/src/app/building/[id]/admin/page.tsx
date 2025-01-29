"use client";

import { LoadingView } from "@/components/LoadingView";
import { useBuildings } from "@/hooks/useBuildings";

type Props = {
  params: { id: string };
};

export default async function AdminPage({ params }: Props) {
  const { id } = params;
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
    </div>
  );
}