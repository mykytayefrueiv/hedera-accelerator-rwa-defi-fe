"use client";

import { notFound } from "next/navigation";
import { slugify } from "@/utils/slugify";
import { SliceDetailPage } from "@/components/Slices/SliceDetailPage";
import { useSlicesData } from "@/hooks/useSlicesData";

type Props = {
  params: Promise<{ id: string; slug: string }>;
};

export default async function Page({ params }: Props) {
  const { id: buildingId, slug } = await params;
  const { slices } = useSlicesData();
  
  const slice = slices.find(
    (slice) => slugify(slice.name) === slugify(slug)
  );

    if (!slice) {
      notFound();
    }
  
    return (
      <SliceDetailPage
        sliceData={{
          ...slice,
          sliceValuation: 0,
          tokenPrice: 0,
          tokenBalance: 0,
        }}
        tokensWithBuilding={[]}
        isInBuildingContext={true}
        buildingId={buildingId}
      />
    );
}
