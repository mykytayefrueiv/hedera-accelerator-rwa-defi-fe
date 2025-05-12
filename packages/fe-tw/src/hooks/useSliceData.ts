import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { readContract } from "@/services/contracts/readContract";
import type { BuildingToken, SliceAllocation } from "@/types/erc3643/types";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const calculateIdealAllocation = (totalAllocationsCount: number) => {
   switch (totalAllocationsCount) {
      case 1:
         return 100;
      default:
         return 100 / totalAllocationsCount;
   } 
};

const readSymbol = (tokenAddress: `0x${string}`) =>
   readContract({
      abi: tokenAbi,
      functionName: "symbol",
      address: tokenAddress.toString(),
      args: [],
   });

const readSliceAllocation = (sliceAddress: `0x${string}`) =>
   readContract({
      abi: sliceAbi,
      functionName: "allocations",
      address: sliceAddress,
      args: [],
   });

const readSliceBaseToken = (sliceAddress: `0x${string}`) => readContract({
   abi: sliceAbi,
   functionName: "baseToken",
   address: sliceAddress,
   args: [],
});

export const useSliceData = (
   sliceAddress: `0x${string}`,
   buildingDeployedTokens: BuildingToken[],
) => {
   const [sliceBuildings, setSliceBuildings] = useState<BuildingToken[]>([]);

   const { data: sliceBaseToken } = useQuery<`0x${string}`>({
      queryKey: ["sliceBaseToken"],
      queryFn: async () => {
         const baseToken = await readSliceBaseToken(sliceAddress);

         return baseToken[0]
      },
      enabled: !!sliceAddress,
   });

   const { data: sliceAllocations } = useQuery<SliceAllocation[]>({
      refetchInterval: 10000,
      queryKey: ["sliceAllocations"],
      queryFn: async () => {
         const allocations = await readSliceAllocation(sliceAddress);
         const allocationTokenNames = await Promise.allSettled(
            allocations[0]
               .filter((allocationLog: any[]) => allocationLog.length > 0)
               .map((allocationLog: any[]) => readSymbol(allocationLog[0])),
         );
         
         return allocations[0]
            .filter((allocationLog: any) => allocationLog[0].length > 0)
            .map((allocationLog: any, index: number) => ({
               aToken: allocationLog[0],
               aTokenName: (allocationTokenNames[index] as { value: any[] }).value[0],
               buildingToken: allocationLog[1],
               idealAllocation: calculateIdealAllocation(allocations[0].length),
               actualAllocation: allocationLog[2],
            }));
      },
      enabled: !!sliceAddress,
      initialData: [],
   });

   useEffect(() => {
      if (sliceAllocations?.length) {
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
      }
   }, [buildingDeployedTokens, sliceAllocations]);

   return { sliceAllocations, sliceBaseToken, sliceBuildings };
};
