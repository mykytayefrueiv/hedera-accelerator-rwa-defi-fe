import React, { useState } from "react";
import { toast } from "sonner";
import { useFormikContext, Form } from "formik";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/ui/formInput";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateSliceFormProps, AddSliceAllocationFormProps } from "./constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import { SliceAllocation } from "@/types/erc3643/types";
import { useBuildings } from "@/hooks/useBuildings";

export const AddSliceAllocationForm = ({ existsAllocations = [] }: { existsAllocations?: SliceAllocation[] }) => {
   const formik = useFormikContext<{
      slice: CreateSliceFormProps,
      sliceAllocation: AddSliceAllocationFormProps,
   }>();
   const { buildings } = useBuildings();
   const [tokensPercentageDialogOpen, setTokensPercentageDialogOpen] = useState(false);
   const [tokenAllocationAmountValue, setTokenAllocationAmountValue] = useState("0");
   const lastSelectedAssetToken = formik.values.sliceAllocation.tokenAssets[formik.values.sliceAllocation.tokenAssets.length - 1];

   return (
      <Form className="grid grid-cols-2 gap-4">
         <Dialog open={tokensPercentageDialogOpen} onOpenChange={(state) => {
            if (!state) {
               if (!formik.values.sliceAllocation.tokenAssetAmounts[lastSelectedAssetToken]) {
                  const newTokenAssets = [...formik.values.sliceAllocation.tokenAssets];
                  newTokenAssets.pop();

                  formik.setFieldValue("sliceAllocation.tokenAssets", newTokenAssets);
                  toast.error("Allocation amount is mandatory for a asset token");
               }
            }

            setTokensPercentageDialogOpen(state);
         }}>
            <DialogContent>
            <DialogHeader>
                  <DialogTitle>
                     Add allocation amount for token {buildings?.find((b) => b.address === lastSelectedAssetToken)?.title}
                  </DialogTitle>
                  <DialogDescription>
                     <span className="text-xs text-red-700">
                        In case of empty amount it's would be assigned automatically.
                     </span>
                  </DialogDescription>
               </DialogHeader>
               <Input
                  placeholder="Enter allocation amount (e.g. 100)"
                  onChange={(e) => {
                     setTokenAllocationAmountValue(e.target.value);
                  }}
               />
               <Button onClick={() => {
                  const newTokenAmountValue = Number(tokenAllocationAmountValue);

                  if (newTokenAmountValue) {
                     formik.setFieldValue("sliceAllocation.tokenAssetAmounts", {
                        ...formik.values.sliceAllocation.tokenAssetAmounts,
                        [lastSelectedAssetToken]: newTokenAmountValue,
                     });
                  } else {
                     formik.setFieldValue("sliceAllocation.tokenAssetAmounts", {
                        ...formik.values.sliceAllocation.tokenAssetAmounts,
                        [lastSelectedAssetToken]: '100',
                     });
                  }

                  setTokensPercentageDialogOpen(false);
               }} type="button" className="lg:w-4/12">
                  Confirm
               </Button>
            </DialogContent>
         </Dialog>

         {/** <div>
            <FormInput
               label="Total allocations amount"
               placeholder="e.g. 10000"
               className="mt-1"
               error={
                  formik.touched?.sliceAllocation?.totalAssetsAmount ? formik.errors?.sliceAllocation?.totalAssetsAmount : undefined
               }
               {...formik.getFieldProps("sliceAllocation.totalAssetsAmount")}
            />
         </div> **/}
      
         <div>
            <FormInput
               label="Deposit amount"
               placeholder="e.g. 100"
               className="mt-1"
               error={
                  formik.touched?.sliceAllocation?.depositAmount ? formik.errors?.sliceAllocation?.depositAmount : undefined
               }
               {...formik.getFieldProps("sliceAllocation.depositAmount")}
            />
         </div>

         <div>
            <FormInput
               label="Token reward amount in USDC"
               placeholder="e.g. 100"
               className="mt-1"
               error={
                  formik.touched?.sliceAllocation?.rewardAmount ? formik.errors?.sliceAllocation?.rewardAmount : undefined
               }
               {...formik.getFieldProps("sliceAllocation.rewardAmount")}
            />
         </div>
      
         <div>
               <Label htmlFor="tokenAssets">Select multiple token assets</Label>
               <Select
                  onValueChange={(value) => {
                     if (formik.values.sliceAllocation?.tokenAssets?.length === 5) {
                        toast.error("It's possble to add maximum of 5 tokens");
                        return;
                     } else if (
                        formik.values.sliceAllocation?.tokenAssets.includes(value) ||
                        !!existsAllocations.find((allocation) => allocation.aToken === value)
                     ) {
                        toast.error("This token has been already selected");
                        return;
                     }
      
                     formik.setFieldValue("sliceAllocation.tokenAssets", [...formik.values.sliceAllocation?.tokenAssets, value]);
                     setTokensPercentageDialogOpen(true);
                  }}
                  required
                  defaultValue={formik.values.sliceAllocation?.tokenAssets[0]}
               >
                  <SelectTrigger className="w-full mt-1">
                     <SelectValue placeholder="e.g 0x.." />
                  </SelectTrigger>
                  <SelectContent>
                     {buildings
                        ?.map((b) => (
                           <SelectItem key={b.address} value={b.address as string}>
                              {b.title}
                           </SelectItem>
                        ))
                     }
               </SelectContent>
               {
                  formik.errors.sliceAllocation?.tokenAssets &&
                  <span className="text-md text-red-500">{formik.errors.sliceAllocation?.tokenAssets}</span>
               }
            </Select>
            {formik.values.sliceAllocation?.tokenAssets?.length > 0 && <div className="flex flex-col mt-5" style={{ overflowX: "scroll" }}>
               <p className="text-sm font-semibold">Selected Token Assets</p>

               {formik.values.sliceAllocation?.tokenAssets?.map(asset => (
                  <Badge className="badge badge-md badge-soft badge-info p-2 m-1" key={asset}>
                     {buildings?.find((b) => b.address === asset)?.title}
                     {asset ? ` ${asset}` : ''}
                     {formik.values.sliceAllocation.tokenAssetAmounts[asset] ? ` (${formik.values.sliceAllocation.tokenAssetAmounts[asset]})` : ''}
                  </Badge>
               ))}

               {!!formik.values.sliceAllocation.tokenAssetAmounts && (
                  <div className="flex flex-col">
                     <p className="text-sm font-semibold mt-5">Total allocation: {
                        Object.values(formik.values.sliceAllocation.tokenAssetAmounts)
                           .reduce((acc, amount) => acc += Number(amount), 0)
                        }
                     </p>
                  </div>
               )}
            </div>}
         </div>
      </Form>
   );
};
