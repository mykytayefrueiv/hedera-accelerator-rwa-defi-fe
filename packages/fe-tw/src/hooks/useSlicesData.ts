import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import { sliceFactoryAbi } from "@/services/contracts/abi/sliceFactoryAbi";
import { SLICE_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { readContract } from "@/services/contracts/readContract";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { fetchJsonFromIpfs } from "@/services/ipfsService";
import type { SliceAllocationSmall, SliceData } from "@/types/erc3643/types";
import { prepareStorageIPFSfileURL } from "@/utils/helpers";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBuildings } from "./useBuildings";

const readSliceAllocation = (sliceAddress: `0x${string}`) =>
   readContract({
      abi: sliceAbi,
      functionName: "allocations",
      address: sliceAddress,
      args: [],
   });

/**
 * Reads slice details from SC.
 * @param address Slice address
 */
const readSliceMetdataUri = (sliceAddress: `0x${string}`) =>
   readContract({
      functionName: "metadataUri",
      address: sliceAddress,
      abi: sliceAbi,
      args: [],
   });

export function useSlicesData() {
   const [sliceAddresses, setSliceAddresses] = useState<`0x${string}`[]>([]);
   const [slices, setSlices] = useState<SliceData[]>([]);
   const [sliceLogs, setSliceLogs] = useState<any[]>([]);
   const [recentSliceLogs, setRecentSliceLogs] = useState<any[]>([]);
   const [recentlyDeployedSlice, setRecentlyDeployedSlice] = useState<`0x${string}`>();
   const { buildings, buildingTokens } = useBuildings();
   
   useEffect(() => {
      const unsubscribe = watchContractEvent({
         address: SLICE_FACTORY_ADDRESS,
         abi: sliceFactoryAbi,
         eventName: "SliceDeployed",
         onLogs: (data) => {
            setSliceLogs(prev => [...prev, ...data]);
         },
      });

      return () => unsubscribe();
   }, []);

   const requestSlicesDetails = useCallback(async () => {
      const slicesMetadataUris = await Promise.all(
         sliceLogs.map((log) => readSliceMetdataUri(log.args[0])),
      );
      const sliceMetdatas = await Promise.all(
         slicesMetadataUris.map((uri: string[]) => fetchJsonFromIpfs(uri[0])),
      );

      setSliceAddresses(sliceLogs.map((log) => log.args[0]));
      setSlices(
         sliceMetdatas.map((m, sliceId) => ({
            id: sliceLogs[sliceId].args[0],
            address: sliceLogs[sliceId].args[0],
            name: m.name,
            allocation: m.allocation,
            description: m.description,
            imageIpfsUrl: prepareStorageIPFSfileURL(m.sliceImageIpfsHash?.replace("ipfs://", "")),
            endDate: m.endDate,
            estimatedPrice: 0,
         })),
      );
   }, [sliceLogs]);

   useEffect(() => {
      if (sliceLogs?.length) {
         requestSlicesDetails();
      }
   }, [sliceLogs, requestSlicesDetails]);

   useEffect(() => {
      if ((sliceLogs?.length > 0 && recentSliceLogs?.length > 0) && recentSliceLogs?.length !== sliceLogs?.length) {
         const newDeployedSlice = [...sliceLogs].pop();

         setRecentlyDeployedSlice(newDeployedSlice.args[0]);
      }

      setRecentSliceLogs(sliceLogs);
   }, [sliceLogs?.length]);

   const { data: slicesAllocationsData } = useQuery({
      queryKey: ["slicesAllocations", slices.map(slice => slice.address)],
      queryFn: async () => {
         const allocationsData = await Promise.allSettled(slices.map(slice => readSliceAllocation(slice.address)));
         let allocations: SliceAllocationSmall[] = [];

         allocationsData.forEach((alloc, index) => {
            allocations = [...allocations, {
               buildingToken: (alloc as any).value[0][1][1],
               slice: slices[index].address,
            }];
         });

         return allocations;
      },
      enabled: slices?.length > 0,
      initialData: [],
   });

   const { data: buildingToSlices } = useQuery({
      queryKey: [
         "buildingToSlices",
         slicesAllocationsData.map(alloc => alloc.buildingToken),
         `buildingsCount_${buildings?.length}`,
         `buildingsTokensCount_${buildingTokens?.length}`,
      ],
      queryFn: async () => {
         const buildingToSlices: { [key: `0x${string}`]: SliceData[] } = {};

         buildings?.forEach(building => {
            const _buildingTokens = buildingTokens.filter(tok => tok.buildingAddress === building.address);

            if (_buildingTokens?.length) {
               buildingToSlices[building.address!] = slicesAllocationsData
                  .filter(alloc => _buildingTokens.find(tok => tok.tokenAddress === alloc.buildingToken))
                  .map(alloc => slices.find(_slice => _slice.address === alloc.slice))
                  .filter(_slice => !!_slice);
            }
         });

         return buildingToSlices;
      },
      enabled: slicesAllocationsData.length > 0,
      initialData: {},
   });

   return {
      sliceAddresses,
      slicesAllocationsData,
      slices,
      buildingToSlices,
      recentlyDeployedSlice,
   };
}
