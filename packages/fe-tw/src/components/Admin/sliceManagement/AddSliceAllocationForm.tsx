import { useATokenVaultData } from "@/hooks/vault/useATokenVaultData";
import React from "react";
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
import { CreateSliceFormProps, AddSliceAllocationFormProps } from "./constants";

export const AddSliceAllocationForm = () => {
   const formik = useFormikContext<{
      slice: CreateSliceFormProps,
      sliceAllocation: AddSliceAllocationFormProps,
   }>();
   const { autoCompounders } = useATokenVaultData();

   return (
      <Form className="grid grid-cols-2 gap-4">
         <div>
            <FormInput
               required
               label="Token Allocation (%)"
               placeholder="e.g. Allocation"
               className="mt-1"
               error={
                  formik.touched?.sliceAllocation?.allocation ? formik.errors?.sliceAllocation?.allocation : undefined
               }
               {...formik.getFieldProps("sliceAllocation.allocation")}
            />
         </div>
         <div>
               <Label htmlFor="tokenAssets">Token Asset (Auto Compounder Token)</Label>
               <Select
                  onValueChange={(value) => {
                     formik.setFieldValue("sliceAllocation.tokenAssets", [...formik.values.sliceAllocation?.tokenAssets, value]);
                  }}
                  required
               >
                  <SelectTrigger className="w-full mt-1">
                     <SelectValue placeholder="Token Asset" />
                  </SelectTrigger>
                  <SelectContent>
                     {autoCompounders.map((token) => (
                        <SelectItem key={token.address} value={token.address}>
                           {token.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
            </Select>
            <div className="flex flex-col mt-5" style={{ overflowX: "scroll" }}>
               {formik.values.sliceAllocation?.tokenAssets?.map(asset => (
                  <p className="text-xs font-semibold text-purple-800" key={asset}>{asset}</p>
               ))}
            </div>
         </div>
      </Form>
   );
};
