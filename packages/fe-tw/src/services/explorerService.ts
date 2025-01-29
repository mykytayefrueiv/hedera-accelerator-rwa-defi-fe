import { buildings } from "@/consts/buildings";
import { featuredDevelopments } from "@/consts/featuredDevelopments";
import { useSlicesData } from "@/hooks/useSlicesData";

export function getExplorerData() {
  const { slices } = useSlicesData();

  return {
    slices,
    buildings,
    featuredDevelopments
  };
}
