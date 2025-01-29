"use client";

import { LoadingView } from "@/components/LoadingView";
import { BuildingDetailPage } from "@/components/Buildings/BuildingDetailsPage";
import { BuildingData } from "@/types/erc3643/types";
import React, { use, Usable } from "react";
import { useBuildings } from "@/hooks/useBuildings";

type Props = {
    params: Promise<{ id: string }>;
};

export default function Home({ params }: Props) {
    const { id } = use<{ id: string }>(params as unknown as Usable<{ id: string }>);
    const { buildings } = useBuildings();

    const building = buildings.find(_building => _building.id === id);

    if (!buildings?.length || !id) {
        return <LoadingView isLoading />;
    } else if (!building) {
        return <p>Not found</p>;
    }

    return <BuildingDetailPage {...building as BuildingData} />;
}
