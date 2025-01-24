"use client";

import { SliceData } from "@/types/erc3643/types";
import { ReusableAvatar } from "../Avatars/ReusableAvatar";

type Props = {
  slice: SliceData;
}

export function SliceItem({ slice }: Props) {
  return (
    <div className="flex flex-col items-center justify-between pt-4 rounded-md bg-white">
      <ReusableAvatar imageSource={slice.imageUrl} imageAlt={slice.name} size="extra-lg" />
      <h3 className="text-lg font-semibold text-center mt-4 mb-3">{slice.name}</h3>
      <p className="text-sm text-gray-600 text-center">
        {slice.description}
      </p>
    </div>
  );
}
