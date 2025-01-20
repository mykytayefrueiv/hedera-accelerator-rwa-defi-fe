"use client";

import { LoadingView } from "@/components/LoadingView";
import { PageRedirect } from "@/components/Page/PageRedirect";
import { BuildingDetailPage } from "@/components/Pages/BuildingDetailsPage";
import { useBuildings } from "@/hooks/useBuildings";
import { BuildingData } from "@/types/erc3643/types";
import React, { use, Usable } from "react";

type Props = {
    params: Promise<{ id: string }>;
};

export default function Home({ params }: Props) {
    const { id } = use<{ id: string }>(params as unknown as Usable<{ id: string }>);
    const { buildings } = useBuildings();

    const buildingData = buildings?.find(item => item.id === id);

    if (!buildings.length) {
        return <LoadingView isLoading />;
    }

    return (
        <PageRedirect notFound={!buildingData}>
            <BuildingDetailPage {...buildingData as BuildingData} />
        </PageRedirect>
    );
}
