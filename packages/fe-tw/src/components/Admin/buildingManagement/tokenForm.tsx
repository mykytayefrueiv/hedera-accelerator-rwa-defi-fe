import { useFormikContext } from "formik";
import { BuildingFormProps } from "@/components/Admin/buildingManagement/types";
import { FormInput } from "@/components/ui/formInput";
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCheck } from "lucide-react";
import { WalkthroughStep } from "@/components/Walkthrough";

const TokenForm = () => {
   const formik = useFormikContext<BuildingFormProps>();

   return (
      <div>
         <div>
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-semibold">Token</h2>
            </div>
            <div className={cn("grid grid-cols-2 gap-4 mt-5")}>
               <WalkthroughStep
                  guideId="ADMIN_BUILDING_GUIDE"
                  stepIndex={7}
                  title="Token settings"
                  description="Choose the token name, symbol, and decimals for your building token."
                  side="top"
               >
                  {({ confirmUserPassedStep }) => (
                     <div className={cn("grid grid-cols-2 gap-4 mt-0")}>
                        <FormInput
                           required
                           label="Token Name"
                           {...formik.getFieldProps("token.tokenName")}
                           onBlur={(e) => {
                              formik.getFieldProps("token.tokenName").onBlur(e);
                              if (
                                 !formik.errors.token?.tokenName &&
                                 formik.touched?.token?.tokenSymbol &&
                                 !formik.errors.token?.tokenSymbol
                              ) {
                                 confirmUserPassedStep();
                              }
                           }}
                           placeholder="e.g. My Building Token"
                           error={
                              formik.touched?.token?.tokenName
                                 ? formik.errors.token?.tokenName
                                 : undefined
                           }
                        />

                        <FormInput
                           required
                           label="Token Symbol"
                           {...formik.getFieldProps("token.tokenSymbol")}
                           onBlur={(e) => {
                              formik.getFieldProps("token.tokenSymbol").onBlur(e);
                              if (
                                 formik.touched?.token?.tokenName &&
                                 !formik.errors.token?.tokenName &&
                                 !formik.errors.token?.tokenSymbol
                              ) {
                                 confirmUserPassedStep();
                              }
                           }}
                           placeholder="e.g. TOK"
                           error={
                              formik.touched?.token?.tokenSymbol
                                 ? formik.errors.token?.tokenSymbol
                                 : undefined
                           }
                        />

                        <FormInput
                           required
                           type="number"
                           label="Token Decimals"
                           {...formik.getFieldProps("token.tokenDecimals")}
                           onBlur={(e) => {
                              formik.getFieldProps("token.tokenDecimals").onBlur(e);
                           }}
                           placeholder="e.g. 18"
                           error={
                              formik.touched?.token?.tokenDecimals
                                 ? formik.errors.token?.tokenDecimals
                                 : undefined
                           }
                        />
                     </div>
                  )}
               </WalkthroughStep>
            </div>
         </div>

         <div className={cn("mt-4")}>
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-semibold">Mint</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
               <WalkthroughStep
                  guideId="ADMIN_BUILDING_GUIDE"
                  stepIndex={8}
                  title="Initial mint amount"
                  description="Specify how many building tokens to mint on deployment. You can mint more later via governance if allowed."
                  side="top"
               >
                  {({ confirmUserPassedStep }) => {
                     const mintProps = formik.getFieldProps("token.mintBuildingTokenAmount");
                     return (
                        <FormInput
                           required
                           type="number"
                           label="Mint Token Amount"
                           {...mintProps}
                           onBlur={(e) => {
                              mintProps.onBlur(e);
                              if (!formik.errors.token?.mintBuildingTokenAmount) {
                                 confirmUserPassedStep();
                              }
                           }}
                           placeholder="e.g. 1000"
                           error={
                              formik.touched?.token?.mintBuildingTokenAmount
                                 ? formik.errors.token?.mintBuildingTokenAmount
                                 : undefined
                           }
                        />
                     );
                  }}
               </WalkthroughStep>
            </div>
         </div>
      </div>
   );
};
export default TokenForm;
