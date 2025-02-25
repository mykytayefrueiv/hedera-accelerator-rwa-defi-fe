"use client";

import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
<<<<<<< HEAD
=======
import { slices } from "@/consts/slices";
>>>>>>> main
import { ClockIcon } from "@/resources/icons/ClockIcon";
import moment from "moment";
import Link from "next/link";
import { slugify } from "@/utils/slugify";
import { useSlicesData } from "@/hooks/useSlicesData";

<<<<<<< HEAD
export const BuildingSlice = ({ sliceId }: { sliceId: string }) => {
    const { slices } = useSlicesData();
=======
export const BuildingSlice = ({ sliceId }: { sliceId: `0x${string}` }) => {
>>>>>>> main
    const slice = slices.find(({ id }) => sliceId === id);

    if (!slice) return null;

    return (
        <Link href={`/slices/${slugify(slice.name)}`} className="cursor-pointer hover:bg-gray-100 p-2 rounded transition">
            <div className="flex flex-row mt-5">
                <ReusableAvatar
                    imageAlt={slice.name}
                    imageSource={slice.imageUrl}
                    size="md"
                    isRounded
                />
                <div className="flex flex-col ml-5 justify-between">
                    <article>
                        <p className="text-lg font-semibold">{slice.name}</p>
                        <p>{slice.description}</p>
                    </article>
                    <div className="flex flex-row items-center">
                        <ClockIcon />
                        <span className="text-xs ml-2 text-slate-700">
                            {moment(slice.timeToEnd).format('dddd, LT')}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
