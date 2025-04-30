"use client";

import React from "react";
import SliceAllocations from "@/components/Slices/SliceAllocations";
import { useBuildings } from "@/hooks/useBuildings";
import { useSliceData } from "@/hooks/useSliceData";
import type { SliceData } from "@/types/erc3643/types";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRebalanceSlice } from "@/hooks/useRebalanceSlice";

interface ExtendedSliceData extends SliceData {
   sliceValuation: number;
   tokenPrice: number;
   tokenBalance: number;
}

type Props = {
   sliceData: ExtendedSliceData;
   isInBuildingContext?: boolean;
   buildingId?: string;
};

export function SliceDetailPage({ sliceData, isInBuildingContext = false, buildingId }: Props) {
   const { buildingTokens } = useBuildings();
   const { sliceAllocations, sliceBuildings } = useSliceData(
      sliceData.address,
      buildingTokens,
   );
   const { rebalanceMutation } = useRebalanceSlice(sliceData?.address);

   const handleConfirmRebalance = async () => {
      const _tx = await rebalanceMutation.mutateAsync();
   };

   return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
         <Breadcrumb>
            <BreadcrumbList>
               <BreadcrumbItem>
                  <BreadcrumbLink href="/explorer">Explorer</BreadcrumbLink>
               </BreadcrumbItem>
               <BreadcrumbSeparator />
               {isInBuildingContext && buildingId ? (
                  <>
                     <BreadcrumbItem>
                        <BreadcrumbLink href={`/building/${buildingId}`}>Building</BreadcrumbLink>
                     </BreadcrumbItem>
                     <BreadcrumbSeparator />
                     <BreadcrumbItem>
                        <BreadcrumbLink href={`/building/${buildingId}/slices`}>
                           Slices
                        </BreadcrumbLink>
                     </BreadcrumbItem>
                  </>
               ) : (
                  <BreadcrumbItem>
                     <BreadcrumbLink href="/slices">Slices</BreadcrumbLink>
                  </BreadcrumbItem>
               )}
               <BreadcrumbSeparator />
               <BreadcrumbItem>
                  <BreadcrumbPage>{sliceData.name}</BreadcrumbPage>
               </BreadcrumbItem>
            </BreadcrumbList>
         </Breadcrumb>

         <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 md:h-64 w-full h-64">
               <img
                  src={sliceData.imageIpfsUrl ?? "/assets/dome.jpeg"}
                  alt={sliceData.name}
                  className="object-cover rounded-lg w-full h-full"
               />
            </div>

            <div className="flex-1">
               <h1 className="text-3xl font-bold mb-2">{sliceData.name}</h1>
               {sliceData.description && <p className="text-base mb-4">{sliceData.description}</p>}

               <div className="bg-white rounded-lg">
                  <h1 className="text-xl font-semibold mb-2">Slice Info</h1>
                  <p className="mb-1">Slice Valuation: ${sliceData.sliceValuation ?? "-"}</p>
                  <p className="mb-1">Token Price: ${sliceData.tokenPrice ?? "-"}</p>
                  <p>Your Balance: {sliceData.tokenBalance ?? 0} tokens</p>
               </div>
            </div>
         </div>

         <SliceAllocations
            allocations={sliceAllocations}
            sliceBuildings={sliceBuildings}
            onConfirmRebalance={handleConfirmRebalance}
         />
      </div>
   );
}
