"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "@/resources/icons/ArrowLeftIcon";
import { useRouter } from "next/navigation";

export const PageBackButton = () => {
    const { back } = useRouter();

    const prevRouteTitle = "Building Explorer";

    return (
        <div className="flex" onClick={() => {
            back();
        }}>
            <ArrowLeftIcon />
            <Link href="/" className="text-md ml-2 font-bold">
              {prevRouteTitle}
            </Link>
        </div>
    )
}
