"use client";

import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Loader } from "lucide-react";
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
import { TxResultToastView } from "@/components/CommonViews/TxResultView";
import { useCreateSlice } from "@/hooks/useCreateSlice";

type Props = {
   slice: SliceData;
   isInBuildingContext?: boolean;
   buildingId?: string;
};

const validateAmountField = (val: any, fieldName: string) => val.when('tokenAssets', ([tokenAssets]: string[][], schema: Yup.Schema) => {
   return schema.test(
      `total_${fieldName}_amount`, `${fieldName} amount can't be empty and > 100`,
      (value: string) => tokenAssets?.length > 0 ? !!Number(value) && Number(value) >= 100 : true
   )
});

const validateAssetsField = (val: any) => val.when('allocationAmount', ([allocationAmount]: string[][], schema: Yup.Schema) => {
   return schema.test(
        'token_assets', 'Minimum amount of assets for allocation is 2',
        (value: string) => value?.length > 0 ? value?.length >=2 : true
   )
});

const VALIDATION_SCHEMA = Yup.object({
   slice: Yup.object(),
   sliceAllocation: Yup.object().shape({
      tokenAssets: validateAssetsField(Yup.array().of(Yup.string())),
      depositAmount: validateAmountField(Yup.string(), 'deposit'),
      rewardAmount: validateAmountField(Yup.string(), 'reward'),
      tokenAssetAmounts: Yup.object(),
      allocationAmount: Yup.string(),
   }),
});

export function SliceDetailPage({ slice, buildingId, isInBuildingContext = false }: Props) {
   const { buildingTokens } = useBuildings();
   const { sliceAllocations, sliceTokenInfo, sliceBuildings } = useSliceData(
      slice.address,
      buildingTokens,
   );
   const { addTokenAssetsToSliceMutation } = useCreateSlice(slice.address);
   const [isAllocationOpen, setIsAllocationOpen] = useState(false);

   const onSubmitForm = async (values: CreateSliceRequestData) => {
      try {
         const txs = await addTokenAssetsToSliceMutation.mutateAsync(values);

         toast.success(
            <TxResultToastView
               title={`Slice ${values.slice.name} successfully rebalanced`}
               txSuccess={{
                  transaction_id: (txs as unknown as string[])[0],
               }}
            />,
            {
               duration: 5000,
            },
         );
      } catch (err) {
         toast.error(
            <TxResultToastView
                title={`Error during slice rebalance ${(err as { message: string }).message}`}
                txError={(err as { message: string }).message}
            />,
            { duration: Infinity, closeButton: true },
        );
      }
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
                  <p>Slice token balance:
                     <span className="text-xs text-purple- font-bold">{' ' + sliceTokenInfo?.tokenBalance?.slice(0, 20)}...</span>
                     {sliceTokenInfo?.tokenName}
                  </p>
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
                     onSubmit={onSubmitForm}
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
