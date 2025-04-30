"use client";

import { SliceDetailPage } from "@/components/Slices/SliceDetailPage";
import { useSlicesData } from "@/hooks/useSlicesData";
import type { SliceData } from "@/types/erc3643/types";
import { slugify } from "@/utils/slugify";
import { notFound } from "next/navigation";
import { type Usable, use } from "react";

type Props = {
   params: Promise<{ id: string; slug: string }>;
};

export default function Page({ params }: Props) {
   const { slug, id: buildingId } = use<{ slug: string; id: string }>(
      params as unknown as Usable<{ slug: string; id: string }>,
   );
   const { slices } = useSlicesData();

   const sliceData = slices.find((slice) => slugify(slice.id) === slugify(slug));

   if (slices?.length > 0) {
      console.log('sliceData', sliceData)
      // notFound();
   }

   const sliceValuation = 0;
   const tokenPrice = 0;
   const userBalance = 0;

   return (
      <SliceDetailPage
         sliceData={{
            ...(sliceData as SliceData),
            sliceValuation,
            tokenPrice,
            tokenBalance: userBalance,
         }}
         isInBuildingContext={true}
         buildingId={buildingId}
      />
   );
}
