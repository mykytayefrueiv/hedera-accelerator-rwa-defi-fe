"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// export interface WalkthroughStep {
//    index: number;
//    title: string;
//    description: string;
// }

// export interface WalkthroughContextType {
//    steps: WalkthroughStep[];
//    currentStepIndex: number;
//    registerStep: (index: number, title: string, description: string) => void;
//    unregisterStep: (index: number) => void;
//    nextStep: () => void;
//    prevStep: () => void;
//    startWalkthrough: () => void;
//    endWalkthrough: () => void;
//    isCurrentStep: (index: number) => boolean;
// }

// const WalkthroughContext = createContext<WalkthroughContextType | undefined>(undefined);

// export const WalkthroughProvider = ({ children }: { children: ReactNode }) => {
//    const [steps, setSteps] = useState<WalkthroughStep[]>([]);
//    const [currentStepIndex, setCurrentStepIndex] = useState(0);

//    const nextStep = () => {
//       if (currentStepIndex < steps.length - 1) {
//          setCurrentStepIndex((prev) => prev + 1);
//       } else {
//          endWalkthrough();
//       }
//    };

//    const prevStep = () => {
//       if (currentStepIndex > 0) {
//          setCurrentStepIndex((prev) => prev - 1);
//       }
//    };

//    const startWalkthrough = () => {
//       setCurrentStepIndex(0);
//    };

//    const endWalkthrough = () => {
//       setCurrentStepIndex(0);
//    };

//    const isCurrentStep = (index: number) => {
//       return steps[currentStepIndex]?.index === index;
//    };

//    const registerStep = (index: number, title: string, description: string) => {
//       setSteps((prev) => {
//          const existingStepIndex = prev.findIndex((step) => step.index === index);

//          let updatedSteps;
//          if (existingStepIndex !== -1) {
//             updatedSteps = [...prev];
//             updatedSteps[existingStepIndex] = { index, title, description };
//          } else {
//             updatedSteps = [...prev, { index, title, description }];
//          }

//          return updatedSteps.sort((a, b) => a.index - b.index);
//       });
//    };

//    const unregisterStep = (index: number) => {
//       setSteps((prev) => prev.filter((step) => step.index !== index));
//    };

//    return (
//       <WalkthroughContext.Provider
//          value={{
//             steps,
//             registerStep,
//             unregisterStep,
//             currentStepIndex,
//             nextStep,
//             prevStep,
//             startWalkthrough,
//             endWalkthrough,
//             isCurrentStep,
//          }}
//       >
//          {children}
//       </WalkthroughContext.Provider>
//    );
// };

export const useWalkthroughStore = create(
   persist(
      (set) => ({
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
      }),
      {
         name: "walkthrough-storage",
         storage: createJSONStorage(() => localStorage),
      },
   ),
);
