import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";

import FENavbar from "@/components/Navbar/FENavbar";
import Footer from "@/components/Footers/Footer";
import { FeaturedSlices } from "@/components/FeaturedSlices";
import { PageHeader } from "@/components/Page/PageHeader";
import { PageContent } from "@/components/Page/PageContent";
import { FeaturedSliceCategory } from "@/components/FeaturedSlices/FeaturedSliceCategory";
import { buildingSliceCategories } from "@/consts/props";

import "./globals.css";

export const metadata: Metadata = {
	title: "B.R.U",
	description: 'Building "R" US - Explorer',
};

export default function Home() {
	return (
        <>
            <FENavbar linksForPage="regularUser">
                <>
                    <PageHeader title='Building "R" US' />
                    <PageContent>
                        <>
                            <article className="prose my-2">
                                <Link href="/dash/featured">
                                    <h2>Featured Slices</h2>
                                </Link>
                            </article>
                            <FeaturedSlices />
                            {buildingSliceCategories.map(category => (
                                <FeaturedSliceCategory key={category.name} {...category} />
                            ))}
                        </>
                    </PageContent>
                </>
            </FENavbar>
            <Footer />
        </>
	);
}
