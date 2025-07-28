import { ReactNode, useEffect } from "react";
import { Popover, PopoverAnchor } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { cx } from "class-variance-authority";
import { useWalkthroughStep } from "./WalkthroughContext";

interface WalkthroughStepProps {
   children: ReactNode;
   stepIndex: number;
   title: string;
   description: string;
}

export const WalkthroughStep = ({
   children,
   stepIndex,
   title,
   description,
}: WalkthroughStepProps) => {
   const { registerStep, unregisterStep, isHighlighted } = useWalkthroughStep(stepIndex);

   useEffect(() => {
      registerStep(stepIndex, title, description);

      return () => {
         unregisterStep(stepIndex);
      };
   }, [stepIndex, title, description]);

   return (
      <div className="relative">
         {isHighlighted && (
            <div
               className={cx(
                  "pointer-events-none outline-2 outline-indigo-500 absolute w-full h-full animate-ping rounded-md",
               )}
            />
         )}
         <Popover open={isHighlighted}>
            <PopoverAnchor>{children}</PopoverAnchor>
            <PopoverContent sideOffset={5}>
               <div className="animate-fade-in-bottom bg-white p-4 rounded-lg shadow-lg border max-w-sm">
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{description}</p>
               </div>
            </PopoverContent>
         </Popover>
      </div>
   );
};
