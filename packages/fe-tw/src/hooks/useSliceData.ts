import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import { readContract } from "@/services/contracts/readContract";
import type { BuildingToken, SliceAllocation } from "@/types/erc3643/types";
import { useState, useEffect } from "react";

const readSliceAllocation = (sliceAddress: `0x${string}`) =>
	readContract({
		abi: sliceAbi,
		functionName: "allocations",
		address: sliceAddress,
		args: [],
	});

export const useSliceData = (
	sliceAddress: `0x${string}`,
	buildingDeployedTokens: BuildingToken[],
) => {
	const [sliceAllocations, setSliceAllocations] = useState<SliceAllocation[]>(
		[],
	);
	const [sliceBuildings, setSliceBuildings] = useState<BuildingToken[]>([]);

	useEffect(() => {
		if (sliceAddress) {
			readSliceAllocation(sliceAddress).then((data) => {
				setSliceAllocations(
					data.map((allocationLog: any) => ({
						aToken: allocationLog[0][0],
						buildingToken: allocationLog[0][1],
						idealAllocation: 100, // todo: how to calculate?
						actualAllocation: allocationLog[0][2],
					})),
				);
			});
		}
	}, [sliceAddress]);

	useEffect(() => {
		if (buildingDeployedTokens?.length > 0 && sliceAllocations?.length > 0) {
			setSliceBuildings(
				sliceAllocations.map(
					(allocation) =>
						buildingDeployedTokens.find(
							(tok) => tok.tokenAddress === allocation.buildingToken,
						)!,
				),
			);
		}
	}, [buildingDeployedTokens, sliceAllocations]);

	return { sliceAllocations, sliceBuildings };
};
