import { isEmpty, reject, orderBy, some } from "lodash";
import { useEffect, memo, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useWalkthroughStore } from "./WalkthroughContext";
import { Button } from "../ui/button";
import { walkthroughBarrier } from "./WalktroughSyncBarrier";

export const useWalkthrough = (guides) => {
   const currentGuide = useWalkthroughStore((state) => state.currentGuide);
   const currentStep = useWalkthroughStore((state) => state.currentStep);
   const setCurrentGuide = useWalkthroughStore((state) => state.setCurrentGuide);
   const finishGuide = useWalkthroughStore((state) => state.finishGuide);
   const setCurrentStep = useWalkthroughStore((state) => state.setCurrentStep);
   const setHideAllGuides = useWalkthroughStore((state) => state.setHideAllGuides);
   const registerGuides = useWalkthroughStore((state) => state.registerGuides);
   const unregisterGuides = useWalkthroughStore((state) => state.unregisterGuides);

   const componentIdRef = useRef(Symbol("walkthrough-component"));
   const readyCallbackRef = useRef(null);

   useEffect(() => {
      if (!isEmpty(guides)) {
         readyCallbackRef.current = walkthroughBarrier.register(componentIdRef.current);

         registerGuides(guides);

         requestAnimationFrame(() => {
            if (readyCallbackRef.current) {
               console.log("signaled that we are done", walkthroughBarrier);
               readyCallbackRef.current();
            }
         });
      }

      return () => {
         unregisterGuides(guides);
         walkthroughBarrier.unregister(componentIdRef.current);
      };
   }, [guides]);

   const getRegistrationFunction = () => {
      return () => {
         // Signal this component is ready
         if (readyCallbackRef.current) {
            readyCallbackRef.current();
         }
      };
   };

   const confirmUserPassedStep = (step) => {
      setCurrentStep(step + 1);
   };

   const confirmUserFinishedGuide = (guideId) => {
      finishGuide(guideId);
      setCurrentGuide(null);
      setCurrentStep(null);
   };

   const WalkthroughHelperCard = memo(({ currentGuide, guides }) => {
      if (
         currentStep !== null ||
         currentGuide === null ||
         !some(guides, { guideId: currentGuide })
      ) {
         return null;
      }

      return (
         <Card className="z-100 fixed right-2 bottom-2 max-w-xs">
            <CardHeader>
               <CardTitle>Wanna be guided?</CardTitle>
               <CardDescription>
                  This is walkthrough, we will help you to navigate and stuff
               </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2 p-6 pt-0">
               <Button onClick={() => setCurrentStep(1)}>Yes</Button>
               <Button onClick={() => confirmUserFinishedGuide(currentGuide)}>No</Button>
               <Button onClick={() => setHideAllGuides(true)}>No, for all</Button>
            </CardContent>
         </Card>
      );
   });

   return {
      WalkthroughHelperCard,
      HelperCardProps: {
         guides,
         currentGuide,
      },
      currentStep,
      confirmUserPassedStep,
      confirmUserFinishedGuide,
      registerComponent: getRegistrationFunction(),
   };
};
