import { Button } from "@/components/ui/button";
import { useWalkthrough } from "./WalkthroughContext";

export const Walkthrough = () => {
   const { startWalkthrough, endWalkthrough, steps, currentStepIndex, nextStep, prevStep } =
      useWalkthrough();

   if (currentStepIndex !== 0) {
      return (
         <div className="fixed bottom-4 right-4">
            <Button onClick={startWalkthrough}>Start Walkthrough</Button>
         </div>
      );
   }

   const currentStep = steps[currentStepIndex];

   return (
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
         <h3 className="font-semibold text-lg">{currentStep.title}</h3>
         <p className="text-sm text-gray-600 mb-4">{currentStep.description}</p>
         <div className="flex gap-2 justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStepIndex === 0}>
               Previous
            </Button>
            <Button onClick={endWalkthrough} variant="outline">
               Skip
            </Button>
            <Button onClick={nextStep}>
               {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
            </Button>
         </div>
      </div>
   );
};
