import { ExpensesView } from "@/components/Expenses/ExpensesView";
import { useBuildings } from "@/hooks/useBuildings";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ExpensesPage({ params }: Props) {
  const { id } = await params;
  const { buildings } = useBuildings();
  const building = buildings.find((b) => b.id === id);

  if (!building) {
    notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
      {building.title}: Expenses
      </h1>
      <ExpensesView buildingId={id} />
    </div>
  );
}
