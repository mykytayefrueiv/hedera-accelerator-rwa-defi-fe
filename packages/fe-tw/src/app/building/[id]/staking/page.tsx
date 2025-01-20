import StakingComponent from "@/components/Staking/StakingOverview";
import { useBuildings } from "@/hooks/useBuildings";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StakingPage({ params }: Props) {
  const { id } = await params;
  const { buildings } = useBuildings();
  const building = buildings.find((b) => b.id === id);

  if (!building) {
    notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Staking for Building: {building.title}
      </h1>
      <StakingComponent buildingId={id} />
    </div>
  );
}
