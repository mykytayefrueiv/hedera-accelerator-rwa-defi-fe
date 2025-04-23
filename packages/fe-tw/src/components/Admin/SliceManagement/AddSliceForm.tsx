import type React from "react";
import { toast } from "sonner";
import { useFormikContext } from "formik";
import { FormInput } from "@/components/ui/formInput";
import { useUploadImageToIpfs } from "@/hooks/useUploadImageToIpfs";
import { UploadFileButton } from "@/components/ui/upload-file-button";
import { CreateSliceFormProps, AddSliceAllocationFormProps } from "./constants";

export const AddSliceForm = () => {
   const { uploadImage, isPending } = useUploadImageToIpfs();
   const formik = useFormikContext<{
      slice: CreateSliceFormProps,
      sliceAllocation: AddSliceAllocationFormProps,
   }>();
   
   return (
      <div>
         <div>
            <div>
               <FormInput
                  required
                  label="Slice Name"
                  placeholder="e.g. MySlice"
                  className="mt-1"
                  error={
                     formik.touched?.slice?.name ? formik.errors?.slice?.name : undefined
                  }
                  {...formik.getFieldProps("slice.name")}
               />
            </div>
            <div>
               <FormInput
                  required
                  label="Slice Description"
                  placeholder="e.g. MySliceDesc"
                  className="mt-1"
                  error={
                     formik.touched?.slice?.description ? formik.errors?.slice?.description : undefined
                  }
                  {...formik.getFieldProps("slice.description")}
               />
            </div>
            <div>
               <FormInput
                  required
                  label="Slice End Date"
                  type="date"
                  placeholder="e.g. 10.05.2025"
                  className="mt-1"
                  error={
                     formik.touched?.slice?.endDate ? formik.errors?.slice?.endDate : undefined
                  }
                  {...formik.getFieldProps("slice.endDate")}
               />
            </div>
            <div>
               <div className="mt-1 flex gap-1">
                  <FormInput
                     label="Slice IPFS Hash"
                     placeholder="e.g. 02323x12142146t512764512763535353535353535"
                     className="mt-1"
                     required
                     error={
                        formik.touched?.slice?.sliceImageIpfsHash ? formik.errors?.slice?.sliceImageIpfsHash : undefined
                     }
                     {...formik.getFieldProps("slice.sliceImageIpfsHash")}
                  />
                  <UploadFileButton
                     isLoading={isPending}
                     onFileAdded={async (file) => {
                        const ipfsHash = await uploadImage(file);
                        formik.setFieldValue("slice.sliceImageIpfsHash", ipfsHash);

                        toast.success(`Image uploaded successfully: ${ipfsHash}`);
                     }}
                  />
               </div>
            </div>
         </div>
      </div>
   )
};
