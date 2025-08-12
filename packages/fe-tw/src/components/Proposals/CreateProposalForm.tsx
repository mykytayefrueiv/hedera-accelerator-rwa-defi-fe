"use client";

import React from "react";
import { toast } from "sonner";
import { Form, Formik } from "formik";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SelectItem } from "@/components/ui/select";
import { FormSelect } from "@/components/ui/formSelect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CreateProposalPayload } from "@/types/erc3643/types";
import { tryCatch } from "@/services/tryCatch";
import { ProposalType } from "@/types/props";
import { TxResultToastView } from "../CommonViews/TxResultView";
import { FormInput } from "@/components/ui/formInput";
import { TransactionExtended } from "@/types/common";
import { validationSchema } from "./constants";
import { map } from "lodash";
import { useBuildingAudit } from "@/hooks/useBuildingAudit";

type Props = {
   buildingAddress: `0x${string}`;
   createProposal: (values: CreateProposalPayload) => Promise<TransactionExtended | undefined>;
   onProposalSuccesseed: () => void;
};

export function CreateProposalForm({
   buildingAddress,
   createProposal,
   onProposalSuccesseed,
}: Props) {
   const { auditors } = useBuildingAudit(buildingAddress);
   const handleSubmit = async (values: CreateProposalPayload & { title: string }) => {
      const { data, error } = await tryCatch<TransactionExtended | undefined, any>(
         createProposal(values),
      );

      if (!!data) {
         toast.success(
            <TxResultToastView title="Proposal submitted successfully!" txSuccess={data} />,
            {
               duration: 5000,
            },
         );
         onProposalSuccesseed();
      } else {
         toast.error(`Proposal submission ${error?.message}`);
      }
   };

   return (
      <Formik
         initialValues={{
            title: "",
            description: "",
            amount: "",
            type: "" as ProposalType,
            to: "",
            auditorWalletAddress: "",
         }}
         validationSchema={validationSchema}
         onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            handleSubmit(values);
         }}
      >
         {({
            getFieldProps,
            setFieldValue,
            handleSubmit,
            isSubmitting,
            values,
            errors,
            touched,
         }) => (
            <Form onSubmit={handleSubmit} className="p-2 mt-4 space-y-4">
               <div>
                  <FormInput
                     required
                     label="Proposal Title"
                     placeholder="Enter proposal title"
                     error={touched.title && errors.title ? errors.title : undefined}
                     {...getFieldProps("title")}
                  />
               </div>

               <div>
                  <Label htmlFor="description">Proposal Description</Label>
                  <Textarea
                     className="mt-1"
                     placeholder="Proposal Description"
                     {...getFieldProps("description")}
                     onChange={(e) => {
                        setFieldValue("description", e.target.value);
                     }}
                  />
               </div>

               {values.type === ProposalType.AddAuditorProposal && (
                  <FormInput
                     required
                     label="Auditor Wallet Address"
                     placeholder="e.g. 0x123"
                     type="text"
                     error={
                        touched.auditorWalletAddress && errors.auditorWalletAddress
                           ? errors.auditorWalletAddress
                           : undefined
                     }
                     {...getFieldProps("auditorWalletAddress")}
                  />
               )}

               {values.type === ProposalType.RemoveAuditorProposal && (
                  <FormSelect
                     name="auditorWalletAddress"
                     label="Auditor Wallet Address"
                     required={true}
                     placeholder="Select Auditor Address"
                     onValueChange={(value) => {
                        setFieldValue("auditorWalletAddress", value);
                     }}
                     error={errors.auditorWalletAddress && touched.auditorWalletAddress ? errors.auditorWalletAddress : undefined}
                  >
                     {map(auditors, (auditor) => (
                        <SelectItem key={auditor} value={auditor}>
                           {auditor}
                        </SelectItem>
                     ))}
                  </FormSelect>
               )}

               {values.type === ProposalType.PaymentProposal && (
                  <div>
                     <Label htmlFor="to">Proposal To</Label>
                     <Input
                        className="mt-1 w-full"
                        placeholder="e.g. 0x123"
                        type="text"
                        {...getFieldProps("to")}
                     />
                     {errors.to && touched.to && (
                        <div className="text-red-500 text-sm mt-1">{errors.to}</div>
                     )}
                  </div>
               )}

               {(values.type === ProposalType.PaymentProposal ||
                  values.type === ProposalType.ChangeReserveProposal) && (
                  <div>
                     <Label htmlFor="amount">Proposal Amount</Label>
                     <Input
                        className="mt-1 w-full"
                        placeholder="e.g. 10"
                        {...getFieldProps("amount")}
                     />
                     {errors.amount && touched.amount && (
                        <div className="text-red-500 text-sm mt-1">{errors.amount}</div>
                     )}
                  </div>
               )}

               <FormSelect
                  name="propType"
                  label="Proposal Type"
                  placeholder="Select Proposal Type"
                  onValueChange={(value) => {
                     setFieldValue("type", value);
                  }}
                  error={errors.type && touched.type ? errors.type : undefined}
               >
                  <SelectItem value={ProposalType.TextProposal}>Text Proposal</SelectItem>
                  <SelectItem value={ProposalType.PaymentProposal}>
                     Payment Proposal
                  </SelectItem>
                  <SelectItem value={ProposalType.AddAuditorProposal}>
                     Add Auditor Proposal
                  </SelectItem>
                  {auditors?.length !== 0 && (
                     <SelectItem value={ProposalType.RemoveAuditorProposal}>
                        Remove Auditor Proposal
                     </SelectItem>
                  )}
                  <SelectItem value={ProposalType.ChangeReserveProposal}>
                     Change Reserve Proposal
                  </SelectItem>
               </FormSelect>

               <Button className="mt-6" isLoading={isSubmitting} type="submit">
                  Submit
               </Button>
            </Form>
         )}
      </Formik>
   );
}
