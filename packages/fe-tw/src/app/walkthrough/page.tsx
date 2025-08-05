"use client";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/formInput";
import { WalkthroughStep } from "@/components/Walkthrough/WalkthroughStep";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useWalkthrough } from "@/components/Walkthrough";

// Validation schema
const validationSchema = Yup.object({
   name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
   lastName: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .required("Last name is required"),
});

const GUIDES = [{ guideId: "USER_BUYING_GUIDE", priority: 2 }];

const Walkthrough = () => {
   const {
      WalkthroughHelperCard,
      HelperCardProps,
      currentStep,
      confirmUserPassedStep,
      confirmUserFinishedGuide,
   } = useWalkthrough(GUIDES);

   const initialValues = {
      name: "",
      lastName: "",
   };

   const handleSubmit = (values) => {
      console.log("Form submitted with values:", values);

      confirmUserFinishedGuide("USER_LOGING_GUIDE");
   };

   return (
      <div className="flex justify-center items-center h-screen flex-col gap-4">
         <WalkthroughStep
            guideId={"USER_BUYING_GUIDE"}
            stepIndex={1}
            title={"Now we will tech you how to buy"}
            description={"Please click the buy button"}
         >
            <Button onClick={() => confirmUserPassedStep(1)}>Buy</Button>
         </WalkthroughStep>

         <WalkthroughStep
            guideId={"USER_BUYING_GUIDE"}
            stepIndex={2}
            title={"Now we will tech you how to buy"}
            description={"Please click the confirm button"}
         >
            <Button
               onClick={() => {
                  if (currentStep === 2) {
                     confirmUserFinishedGuide("USER_BUYING_GUIDE");
                  }
               }}
            >
               Confirm
            </Button>
         </WalkthroughStep>

         <WalkthroughHelperCard {...HelperCardProps} />
      </div>
   );
};

export default Walkthrough;
