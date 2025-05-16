"use client";

import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Loader } from "lucide-react";
import { useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { Button } from "@/components/ui/button";
import { INITIAL_VALUES } from "../Admin/sliceManagement/constants";
import SliceAllocations from "@/components/Slices/SliceAllocations";
import { useBuildings } from "@/hooks/useBuildings";
import { useSliceData } from "@/hooks/useSliceData";
import type { CreateSliceRequestData, SliceData } from "@/types/erc3643/types";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AddSliceAllocationForm } from "@/components/Admin/sliceManagement/AddSliceAllocationForm";
import { useCreateSlice } from "@/hooks/useCreateSlice";
import { getTokenBalanceOf, getTokenName } from "@/services/erc20Service";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { parseUnits } from "ethers";
import { basicVaultAbi } from "@/services/contracts/abi/basicVaultAbi";

type Props = {
   slice: SliceData;
   isInBuildingContext?: boolean;
   buildingId?: string;
};

const VALIDATION_SCHEMA = Yup.object({
   slice: Yup.object(),
   sliceAllocation: Yup.object().shape({
      tokenAssetAmounts: Yup.object(),
      tokenAssets: Yup.array().of(Yup.string()).when(['sliceAllocation.totalAssetsAmount'], (a, schema) => 
         schema.test(
            "token_assets",
            "More when one token should be selected in order to add allocation",
            value => !!a ? !!value && value?.length > 0 : true
         )
      ),
      totalAssetsAmount: Yup.string().when(['sliceAllocation.tokenAssets'], (a, schema) => 
         schema.test(
            "total_deposit_amount",
            "Total deposit amount should be provided",
            value => a.length > 0 ? Number(value) > 0 : true
         )
      ),
   }),
});

export function SliceDetailPage({ slice, buildingId, isInBuildingContext = false }: Props) {
   const { buildingTokens } = useBuildings();
   const { readContract } = useReadContract();
   const { sliceAllocations, sliceBaseToken, sliceBuildings } = useSliceData(
      slice.address,
      buildingTokens,
   );
   const { addSliceTokenAssetsMutation, rebalanceSliceMutation } = useCreateSlice(slice.address);
   const { data: evmAddress } = useEvmAddress();
   const [isAllocationOpen, setIsAllocationOpen] = useState(false);
   const [sliceValuationCup, setSliceValuationCup] = useState({
      valuation: '--',
      tokenPrice: '--',
      tokenBalance: '--',
      tokenName: '',
   });

   const getCompounderAssets = async (acTokens: string[]) => {
      const autoCompounderVaults = await Promise.allSettled(
         acTokens.map(vault => readContract({
            abi: basicVaultAbi,
            address: vault as `0x${string}`,
            functionName: 'asset',
            args: [],
         }))
      );
           
      return autoCompounderVaults.map(asset => (asset as { value: `0x${string}` }).value);
   };

   const handleAddAllocationSubmit = async (values: CreateSliceRequestData) => {
      const underlyingAssets = await getCompounderAssets(values.sliceAllocation.tokenAssets);

      await addSliceTokenAssetsMutation.mutateAsync({
         ...values,
         underlyingAssets,
      });
      await rebalanceSliceMutation.mutateAsync({
         ...values,
         vaults: [],
      });
      
      setIsAllocationOpen(false);
   };

   useEffect(() => {
      if (sliceBaseToken && evmAddress) {
         getTokenBalanceOf(sliceBaseToken, evmAddress).then(data => {
            setSliceValuationCup(prev => ({
               ...prev,
               tokenBalance: parseUnits(data[0]?.toString(), 6).toString(),
            }));
         });

         getTokenName(sliceBaseToken).then(data => {
            setSliceValuationCup(prev => ({
               ...prev,
               tokenName: data[0],
            }));
         });
      }
   }, [sliceBaseToken, evmAddress]);

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
                  <BreadcrumbPage>{slice.name}</BreadcrumbPage>
               </BreadcrumbItem>
            </BreadcrumbList>
         </Breadcrumb>

         <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 md:h-64 w-full h-64">
               <img
                  src={slice.imageIpfsUrl ?? "/assets/dome.jpeg"}
                  alt={slice.name}
                  className="object-cover rounded-lg w-full h-full"
               />
            </div>

            <div className="flex-1">
               <h1 className="text-3xl font-bold mb-2">{slice.name}</h1>
               {slice.description && <p className="text-base mb-4">{slice.description}</p>}

               <div className="bg-white rounded-lg">
                  <h1 className="text-xl font-semibold mb-2">Slice Info</h1>
                  <p className="mb-1">Slice token price: {sliceValuationCup.tokenPrice}</p>
                  <p>Slice token balance: {sliceValuationCup.tokenBalance} {sliceValuationCup.tokenName}</p>
               </div>
            </div>
         </div>

         <SliceAllocations
            allocations={sliceAllocations}
            sliceBuildings={sliceBuildings}
            onAddAllocation={() => {
               setIsAllocationOpen(true);
            }}
         />

         {isAllocationOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full">
               <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6" style={{ minWidth: '60%' }}>
                  <Formik
                     initialValues={{
                        ...INITIAL_VALUES,
                        sliceAllocation: {
                           ...INITIAL_VALUES.sliceAllocation,
                           tokenAssetAmounts: sliceAllocations.reduce((acc, alloc) => {
                              return {
                                 ...acc,
                                 [alloc.aToken]: alloc.actualAllocation.toString(),
                              };
                           }, {}),
                        },
                     }}
                     validationSchema={VALIDATION_SCHEMA}
                     onSubmit={handleAddAllocationSubmit}
                  >
                     {({ isSubmitting, submitForm }) => (
                        <div>
                           <Button
                              type="button"
                              onClick={() => {
                                 setIsAllocationOpen(false);
                              }}
                              variant="outline"
                              className="text-gray-500 hover:text-gray-700"
                           >
                              ✕
                           </Button>
                           <div className="mt-6">
                              <AddSliceAllocationForm existsAllocations={sliceAllocations} />
                           </div>
                           <div className="mt-6">
                              <Button
                                 type="submit"
                                 variant="default"
                                 disabled={isSubmitting}
                                 onClick={submitForm}
                              >
                                 Add Allocation
                              </Button>
                           </div>
                           <div className="mt-6">
                              {isSubmitting && <Loader size={64} className="animate-spin" />}
                           </div>
                        </div>
                     )}
                  </Formik>
               </div>
            </div>
         )}
      </div>
   );
}
