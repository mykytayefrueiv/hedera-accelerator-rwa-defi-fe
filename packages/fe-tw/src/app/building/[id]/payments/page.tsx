import { PaymentsView } from "@/components/Payments/PaymentsView";
import { useBuildings } from "@/hooks/useBuildings";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PaymentsPage({ params }: Props) {
  const { id } = await params;
  const { buildings } = useBuildings();
  const building = buildings.find((b) => b.id === id);

  if (!building) {
    notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
      {building.title}: Payments
      </h1>
      <PaymentsView buildingId={id} />
    </div>
  );
}
