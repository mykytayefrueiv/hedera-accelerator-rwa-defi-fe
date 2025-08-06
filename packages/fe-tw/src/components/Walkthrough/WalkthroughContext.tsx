"use client";
import { isEmpty, orderBy, reject } from "lodash";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useWalkthroughStore = create(
   persist(
      (set, get) => ({
         pendingRegisterComponent: 0,

         registeredGuidesOnThePage: [],
         finishedGuides: [],
         hideAllGuides: false,
         currentGuide: null,
         currentStep: null,

         setCurrentGuide: (guideId: string) => set({ currentGuide: guideId }),
         setCurrentStep: (step: number) => set({ currentStep: step }),
         finishGuide: (guideId: string) =>
            set((state) => ({ finishedGuides: [...state.finishedGuides, guideId] })),
         setHideAllGuides: (hideAllGuides: boolean) => set({ hideAllGuides }),

         registerGuides: (guides: { guideId: string; priority: number }[]) =>
            set((state) => ({
               registeredGuidesOnThePage: [...state.registeredGuidesOnThePage, ...guides],
            })),
         unregisterGuide: (guideId: string) =>
            set((state) => ({
               registeredGuidesOnThePage: state.registeredGuidesOnThePage.filter(
                  (guide) => guide.guideId !== guideId,
               ),
            })),
         unregisterGuides: (guides) =>
            set((state) => ({
               registeredGuidesOnThePage: state.registeredGuidesOnThePage.filter(
                  (guide) => !guides?.some((g) => g.guideId === guide.guideId),
               ),
            })),

         initializeWalkthrough: () => {
            console.log("initialized");
            const state = get();
            if (!isEmpty(state.registeredGuidesOnThePage)) {
               if (state.currentGuide !== null) {
                  // wtf
               } else {
                  const notFinishedGuides = reject(state.registeredGuidesOnThePage, ({ guideId }) =>
                     state.finishedGuides.includes(guideId),
                  );
                  console.log("notFinishedGuides :>> ", notFinishedGuides);
                  const sortedByPriority = orderBy(notFinishedGuides, "priority", ["asc"]);
                  if (!isEmpty(sortedByPriority)) {
                     console.log("zapustili?", sortedByPriority);
                     state.setCurrentGuide(sortedByPriority[0].guideId);
                  }
               }
            }
         },
      }),
      {
         name: "walkthrough-storage",
         storage: createJSONStorage(() => localStorage),
      },
   ),
);
