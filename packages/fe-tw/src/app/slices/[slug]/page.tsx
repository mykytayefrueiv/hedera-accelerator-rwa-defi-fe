"use client";

import React, { use, Usable } from "react";
import { slugify } from "@/utils/slugify";
import { SliceDetailPage } from "@/components/Slices/SliceDetailPage";
import { useSlicesData } from "@/hooks/useSlicesData";
import { SliceData } from "@/types/erc3643/types";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default function Page({ params }: Props) {
  const { slug } = use<{ slug: string }>(params as unknown as Usable<{ slug: string }>);
  const { slices } = useSlicesData();

  const slice = slices.find(
    (slice) => slugify(slice.id) === slugify(slug)
  );

  if (slices?.length > 0 && !slice) {
    notFound();
  }

  return (
    <SliceDetailPage
      sliceData={{
        ...slice as SliceData,
        sliceValuation: 0,
        tokenPrice: 0,
        tokenBalance: 0,
      }}
      tokensWithBuilding={[]}
    />
  );
}
