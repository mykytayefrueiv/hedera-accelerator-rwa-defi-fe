"use client";

import { notFound } from "next/navigation";
import { slugify } from "@/utils/slugify";
import { SliceDetailPage } from "@/components/Slices/SliceDetailPage";
import { useSlicesData } from "@/hooks/useSlicesData";

type Props = {
  params: { slug: string };
};

export default function Page({ params }: Props) {
  const { slug } = params;
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
    />
  );
}
