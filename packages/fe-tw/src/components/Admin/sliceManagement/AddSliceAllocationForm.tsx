import { useATokenVaultData } from "@/hooks/vault/useATokenVaultData";
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

export const AddSliceAllocationForm = ({ existsAllocations = [] }: { existsAllocations?: SliceAllocation[] }) => {
   const formik = useFormikContext<{
      slice: CreateSliceFormProps,
      sliceAllocation: AddSliceAllocationFormProps,
   }>();
   const { autoCompounders } = useATokenVaultData();
   const [tokensPercentageDialogOpen, setTokensPercentageDialogOpen] = useState(false);
   const [tokensPercentageValue, setTokensPercentageValue] = useState("0");
   const lastSelectedAssetToken = formik.values.sliceAllocation.tokenAssets[formik.values.sliceAllocation.tokenAssets.length - 1];

   return (
      <Form className="grid grid-cols-2 gap-4">
         <Dialog open={tokensPercentageDialogOpen} onOpenChange={(state) => {
            if (!state) {
               if (!formik.values.sliceAllocation.tokenAssetAmounts[lastSelectedAssetToken]) {
                  const newTokenAssets = [...formik.values.sliceAllocation.tokenAssets];
                  newTokenAssets.pop();

                  formik.setFieldValue("sliceAllocation.tokenAssets", newTokenAssets);
                  toast.error("Allocation percentage is mandatory for a asset token");
               }
            }

            setTokensPercentageDialogOpen(state);
         }}>
            <DialogContent>
            <DialogHeader>
                  <DialogTitle>
                     Add allocation percentage for token {autoCompounders.find(comp => comp.address === lastSelectedAssetToken)?.name}
                  </DialogTitle>
                  <DialogDescription>
                     <span className="text-xs text-red-700">
                        In case of empty value percentage token amount would be assigned automatically.
                     </span>
                  </DialogDescription>
               </DialogHeader>
               <Input
                  placeholder="Enter allocation percentage % (e.g 10)"
                  onChange={(e) => {
                     setTokensPercentageValue(e.target.value);
                  }}
               />
               <Button onClick={() => {
                  const newTokensPercentageValue = Number(tokensPercentageValue);

                  if (newTokensPercentageValue > 0) {
                     const tokensPercentageValueActive = Object.values(
                        formik.values.sliceAllocation.tokenAssetAmounts
                     )?.reduce((acc, amount) => acc += Number(amount), 0) + newTokensPercentageValue;

                     if (tokensPercentageValueActive > 100) {
                        toast.error("Percentage can't be more then 100 in total");
                     } else {
                        formik.setFieldValue("sliceAllocation.tokenAssetAmounts", {
                           ...formik.values.sliceAllocation.tokenAssetAmounts,
                           [lastSelectedAssetToken]: tokensPercentageValue,
                        });
                     }
                  } else {
                     const tokensPercentageValueActive = Object.values(
                        formik.values.sliceAllocation.tokenAssetAmounts
                     )?.reduce((acc, amount) => acc += Number(amount), 0) + 10;

                     if (tokensPercentageValueActive > 100) {
                        toast.error("Percentage can't be more then 100 in total");
                     } else {
                        formik.setFieldValue("sliceAllocation.tokenAssetAmounts", {
                           ...formik.values.sliceAllocation.tokenAssetAmounts,
                           [lastSelectedAssetToken]: '10',
                        });
                     }
                  }

                  setTokensPercentageDialogOpen(false);
               }} type="button" className="lg:w-4/12">
                  Confirm
               </Button>
            </DialogContent>
         </Dialog>

         <div>
            <FormInput
               label="Token deposit amount in USDC"
               placeholder="e.g. 100"
               className="mt-1"
               error={
                  formik.touched?.sliceAllocation?.totalAssetsAmount ? formik.errors?.sliceAllocation?.totalAssetsAmount : undefined
               }
               {...formik.getFieldProps("sliceAllocation.totalAssetsAmount")}
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
                     {autoCompounders
                        .map((token) => (
                           <SelectItem key={token.address} value={token.address}>
                              {token.name}
                           </SelectItem>
                        ))
                     }
               </SelectContent>
               {
                  formik.errors.sliceAllocation?.tokenAssets &&
                  <span className="text-xs text-red-700">{formik.errors.sliceAllocation?.tokenAssets}</span>
               }
            </Select>
            {formik.values.sliceAllocation?.tokenAssets?.length > 0 && <div className="flex flex-col mt-5" style={{ overflowX: "scroll" }}>
               <p className="text-sm font-semibold">Selected Token Assets</p>

               {formik.values.sliceAllocation?.tokenAssets?.map(asset => (
                  <Badge className="badge badge-md badge-soft badge-info p-2 m-1" key={asset}>
                     {autoCompounders.find(comp => comp.address === asset)?.name}
                     {asset ? ` ${asset}` : ''}
                     {formik.values.sliceAllocation.tokenAssetAmounts[asset] ? ` (${formik.values.sliceAllocation.tokenAssetAmounts[asset]}%)` : ''}
                  </Badge>
               ))}

               {!!formik.values.sliceAllocation.tokenAssetAmounts && (
                  <div className="flex flex-col">
                     <p className="text-sm font-semibold mt-5">Total selected percentage: {
                        Object.values(formik.values.sliceAllocation.tokenAssetAmounts)
                           .reduce((acc, amount) => acc += Number(amount), 0)
                        }%
                     </p>
                  </div>
               )}
            </div>}
         </div>
      </Form>
   );
};
