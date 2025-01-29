import { notFound } from "next/navigation";
import { useBuildings } from "@/hooks/useBuildings";
import SliceCardGrid from "@/components/Slices/SliceCardGrid";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SlicesPage({ params }: Props) {
  const { id } = await params;
  const { buildings } = useBuildings();
  const building = buildings.find((b) => b.id === id);

  if (!building) {
    notFound();
  }

  return (
    <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">
    {building.title}: Slices
    </h1>
      <SliceCardGrid sliceIds={building.partOfSlices || []} />
    </div>
  );
}
