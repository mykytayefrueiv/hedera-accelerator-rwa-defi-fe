import { isEmpty, reject, orderBy, some } from "lodash";
import { useEffect, memo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useWalkthroughStore } from "./WalkthroughContext";
import { Button } from "../ui/button";

export const useWalkthrough = (guides) => {
   const currentGuide = useWalkthroughStore((state) => state.currentGuide);
   const currentStep = useWalkthroughStore((state) => state.currentStep);
   const finishedGuides = useWalkthroughStore((state) => state.finishedGuides);
   const setCurrentGuide = useWalkthroughStore((state) => state.setCurrentGuide);
   const finishGuide = useWalkthroughStore((state) => state.finishGuide);
   const setCurrentStep = useWalkthroughStore((state) => state.setCurrentStep);
   const setHideAllGuides = useWalkthroughStore((state) => state.setHideAllGuides);

   const registeredGuidesOnThePage = useWalkthroughStore(
      (state) => state.registeredGuidesOnThePage,
   );
   const registerGuides = useWalkthroughStore((state) => state.registerGuides);
   const unregisterGuides = useWalkthroughStore((state) => state.unregisterGuides);
   const unregisterAllGuides = useWalkthroughStore((state) => state.unregisterAllGuides);

   useEffect(() => {
      if (!isEmpty(guides)) {
         registerGuides(guides);
      }

      return () => unregisterGuides(guides);
   }, [guides]);

   // useEffect(() => {
   //    if (!isEmpty(registeredGuidesOnThePage)) {
   //       console.log("we didint come here did we", currentGuide);
   //       if (currentGuide !== null) {
   //          // wtf
   //       } else {
   //          const notFinishedGuides = reject(guides, ({ guideId }) =>
   //             finishedGuides.includes(guideId),
   //          );

   //          console.log("notFinishedGuides :>> ", notFinishedGuides);

   //          const sortedByPriority = orderBy(notFinishedGuides, "priority", ["asc"]);

   //          if (!isEmpty(sortedByPriority)) {
   //             console.log("zapustili?", sortedByPriority);
   //             setCurrentGuide(sortedByPriority[0].guideId);
   //          }
   //       }
   //    }
   // }, [currentGuide, registeredGuidesOnThePage]);

   const getRegistrationFunction = () => {
      
      return (guides) => {

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
   };
};
