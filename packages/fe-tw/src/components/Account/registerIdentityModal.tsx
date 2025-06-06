import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Shield } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import countries from "i18n-iso-countries";
import englishLocale from "i18n-iso-countries/langs/en.json";
import { toast } from "sonner";
import { TxResultToastView } from "../CommonViews/TxResultView";
import { useIdentity } from "./useIdentity";

countries.registerLocale(englishLocale);

interface IProps {
   isModalOpened: boolean;
   onOpenChange: (open: boolean) => void;
}

const validationSchema = Yup.object({
   country: Yup.string().required("Country selection is required"),
});

const RegisterIdentityModal = ({ isModalOpened, onOpenChange }: IProps) => {
   const { deployIdentity } = useIdentity();
   const [isDeploying, setIsDeploying] = useState(false);

   const countryOptions = Object.entries(countries.getNames("en", { select: "official" }))
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));

   const handleDeployIdentity = async (values: { country: string }) => {
      setIsDeploying(true);
      try {
         const result = await deployIdentity(values.country);

         if (result.success) {
            toast.success(
               <TxResultToastView title="Identity registered successfully!" txSuccess={result} />,
            );
            onOpenChange(false);
         } else {
            toast.error(
               <TxResultToastView title="Error registering identity" txError={result.error} />,
               { duration: Infinity },
            );
         }
      } catch (err: any) {
         toast.error(
            <TxResultToastView title="Error registering identity" txError={err.message} />,
            { duration: Infinity },
         );
      } finally {
         setIsDeploying(false);
      }
   };

   return (
      <Dialog open={isModalOpened} onOpenChange={onOpenChange}>
         <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className="max-w-md border-indigo-100"
         >
            <DialogHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg border-b border-indigo-100 p-6 -m-6 mb-6">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                     <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                     <DialogTitle className="text-xl text-indigo-900">
                        Register Identity
                     </DialogTitle>
                     <DialogDescription className="text-indigo-700/70">
                        Register ERC3643 compliant identity for your wallet
                     </DialogDescription>
                  </div>
               </div>
            </DialogHeader>

            <div className="space-y-6">
               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 text-center">
                     You need to register ERC3643 compliant identity for your wallet to interact
                     with this tokenized building.
                  </p>
               </div>

               <Formik
                  initialValues={{
                     country: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                     await handleDeployIdentity(values);
                     setSubmitting(false);
                     if (!isDeploying) {
                        resetForm();
                     }
                  }}
               >
                  {({ setFieldValue, values, errors, touched }) => (
                     <Form className="space-y-6">
                        <div className="space-y-2">
                           <label htmlFor="country" className="text-sm font-medium text-gray-700">
                              Country of Residence
                           </label>
                           <Select
                              name="country"
                              onValueChange={(value) => setFieldValue("country", value)}
                              value={values.country}
                           >
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                              <SelectContent className="max-h-60">
                                 {countryOptions.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                       {country.name} ({country.code})
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           {touched.country && errors.country && (
                              <p className="text-sm text-red-600">{errors.country}</p>
                           )}
                        </div>

                        <div className="flex gap-3">
                           <Button
                              type="button"
                              variant="outline"
                              className="flex-1"
                              onClick={() => onOpenChange(false)}
                              disabled={isDeploying}
                           >
                              Cancel
                           </Button>
                           <Button
                              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                              disabled={isDeploying || !values.country}
                              isLoading={isDeploying}
                              type="submit"
                           >
                              {isDeploying ? "Registering..." : "Register Identity"}
                           </Button>
                        </div>
                     </Form>
                  )}
               </Formik>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default RegisterIdentityModal;
