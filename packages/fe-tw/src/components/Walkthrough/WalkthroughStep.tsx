"use client";
import { ReactNode, useEffect } from "react";
import { Popover, PopoverAnchor } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { cx } from "class-variance-authority";
import { useWalkthroughStore } from "./WalkthroughContext";

interface WalkthroughStepProps {
   children: ReactNode;
   className?: string;
   guideId: string;
   stepIndex: number;
   title: string;
   description: string;
}

export const WalkthroughStep = ({
   children,
   className,
   guideId,
   stepIndex,
   title,
   description,
}: WalkthroughStepProps) => {
   const currentStep = useWalkthroughStore((state) => state.currentStep);
   const currentGuide = useWalkthroughStore((state) => state.currentGuide);

   const isHighlighted = currentStep === stepIndex && currentGuide === guideId;

   return (
      <div className={cx("relative", className)}>
         {isHighlighted && (
            <div
               className={cx(
                  "pointer-events-none outline-2 outline-indigo-500 absolute w-full h-full animate-ping rounded-md",
               )}
            />
         )}
         <Popover open={isHighlighted}>
            <PopoverAnchor>{children}</PopoverAnchor>
            <PopoverContent className="z-100" sideOffset={5}>
               <div className="animate-fade-in-bottom bg-white p-4 rounded-lg shadow-lg border max-w-sm">
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{description}</p>
               </div>
            </PopoverContent>
         </Popover>
      </div>
   );
};
