import { useState, useMemo } from "react";
import { useBuildings } from "./useBuildings";
import { getSliceTags, buildingMatchesSlice, getBuildingTags, tokenize } from "@/utils/tagFilters";
import { getExplorerData } from "@/services/explorerService";

export function useExplorerData() {
  const { slices, featuredDevelopments } = getExplorerData();
  const { buildings } = useBuildings();

  const [selectedSlice, setSelectedSlice] = useState(slices[0]);

  const selectedSliceTags = useMemo(() => selectedSlice ? getSliceTags(selectedSlice.name) : [], [selectedSlice]);

  const filteredDevelopments = useMemo(() => {
    return featuredDevelopments.filter(dev => {
      const devTags = tokenize(dev.location);
      return selectedSliceTags.every(t => devTags.includes(t));
    });
  }, [featuredDevelopments, selectedSliceTags]);

  // single slice buildings
  const singleSliceBuildings = useMemo(() => {
    return buildings.filter(b => b.partOfSlices.includes(selectedSlice.id));
  }, [buildings, selectedSliceTags]);

  // multi-slice logic with rand
  const otherSlices = useMemo(() => slices.filter(s => s.id !== selectedSlice?.id), [slices, selectedSlice]);
  const randomSlice = useMemo(() => {
    if (otherSlices.length === 0) return null;
    return otherSlices[Math.floor(Math.random() * otherSlices.length)];
  }, [otherSlices]);

  const randomSliceTags = useMemo(() => (randomSlice ? getSliceTags(randomSlice.name) : []), [randomSlice]);

  const multiSliceBuildings = useMemo(() => {
    if (!randomSlice) return null;

    const combinedTags = [...selectedSliceTags, ...randomSliceTags];

    return {
      sliceName: randomSlice.name,
      buildings: buildings.filter(b => buildingMatchesSlice(getBuildingTags(b), combinedTags)),
    };
  }, [randomSlice, selectedSliceTags, randomSliceTags, buildings]);

  return {
    slices,
    featuredDevelopments: filteredDevelopments,
    singleSliceBuildings,
    multiSliceBuildings,
    buildings,
    selectedSlice,
    setSelectedSlice
  };
}
