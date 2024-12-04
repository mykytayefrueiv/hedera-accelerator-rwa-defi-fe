import { SliceDetailPage } from "@/components/Pages/SliceDetailPage";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function Home({ params }: Props) {
    const { id } = await params;

	return <SliceDetailPage sliceId={id} />;
}
