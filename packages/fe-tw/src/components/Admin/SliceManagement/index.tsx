"use client";

import { Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import some from "lodash/some";
import { Button } from "@/components/ui/button";
import {
    Stepper,
    StepperStep,
    StepperStepContent,
    StepperStepStatus,
    StepperStepTitle,
} from "@/components/ui/stepper";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { LoadingView } from "@/components/LoadingView/LoadingView";
import { CreateSliceRequestBody } from "@/types/erc3643/types";
import { useCreateSlice } from "@/hooks/useCreateSlice";
import { INITIAL_VALUES, STEPS, FRIENDLY_STEP_NAME, FRIENDLY_STEP_STATUS, VALIDATION_SCHEMA } from "./constants";
import { AddSliceForm } from "./AddSliceForm";
import { AddSliceAllocationForm } from "./AddSliceAllocationForm";
import { StepsStatus } from "../buildingManagement/types";

type SliceDeploymentStep = 'slice' | 'sliceAllocation';

const getCurrentStepState = (
    isSelecte: boolean,
    hasErrors: boolean,
    sDirty: boolean,
    isSubmitting: boolean,
    step: SliceDeploymentStep
): StepsStatus => {
    if (step === 'slice') {
        return StepsStatus.DEPLOYED;
    }

    if (step === 'sliceAllocation') {
        return StepsStatus.DEPLOYED;
    }

    return StepsStatus.IN_PROGRESS;
};

// className={cn(tokenDeployed && "opacity-50 pointer-events-none")}
export const SliceManagement = () => {
    const [currentSetupStep, setCurrentSetupStep] = useState(1);
    const [txResult, setTxResult] = useState<string>();
    const [txError, setTxError] = useState<string>();
    const [isTransactionInProgress, setIsTransactionInProgress] = useState<boolean>(false);
    const { handleCreateSlice, addSliceAllocation } = useCreateSlice();
        
    // CreateSliceRequestBody
    const handleSubmit = async (values: any) => {
        try {
           setIsTransactionInProgress(true);
           const txOrHash = await handleCreateSlice(values);
  
           // toast.success(`Slice ${values.name} created successfully`);
           setTxResult(txOrHash);
        } catch (err) {
           setTxError((err as unknown as { message: string }).message);
        } finally {
           setIsTransactionInProgress(false);
        }
    };
    
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Slice Management</h1>
            <p className="mb-4">
                Create and manage slice, include deployment of new slice.
            </p>

            {isTransactionInProgress ? (
                <LoadingView isLoading />
            ) : (
                <Formik
                    initialValues={INITIAL_VALUES}
                    validationSchema={VALIDATION_SCHEMA}
                    onSubmit={handleSubmit}
                >
                {({ errors, touched, isSubmitting, submitForm }) => (
                    <>
                        <Stepper>
                            {STEPS.map((step, stepId) => {
                                const currentState = getCurrentStepState(
                                    currentSetupStep === stepId + 1,
                                    some(errors[step as SliceDeploymentStep], (_, value) => !!value),
                                    some(touched[step as SliceDeploymentStep], (_, value) => !!value),
                                    isSubmitting,
                                    step as SliceDeploymentStep,
                                );
                                    
                                return (
                                    <StepperStep
                                        key={step}
                                        data-state={currentState}
                                        onClick={() => setCurrentSetupStep(stepId + 1)}
                                    >
                                        <StepperStepContent>
                                            <StepperStepTitle>
                                                {FRIENDLY_STEP_NAME[step as 'slice']}
                                            </StepperStepTitle>
                                            <StepperStepStatus>
                                                {FRIENDLY_STEP_STATUS[currentState]}
                                            </StepperStepStatus>
                                        </StepperStepContent>
                                    </StepperStep>
                                );
                            })}
                        </Stepper>

                        <div className="mt-4">
                            {currentSetupStep === 1 && (
                                <AddSliceForm />
                            )}
                            {currentSetupStep === 2 && (
                                <AddSliceAllocationForm />
                            )}
                        </div>

                        <div className="flex justify-end">
                            {currentSetupStep === 1 ? (
                                <Button
                                    size="lg"
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentSetupStep((step) => step + 1)}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button type="submit" onClick={submitForm}>
                                    Deploy Slice
                                </Button>
                            )}
                        </div>
                    </>
                )}
                </Formik>
            )}

            {/** <Dialog open={isModalOpened} onOpenChange={(state) => setIsModalOpened(state)}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>
                        {error
                            ? "Error occurred"
                            : `${MAJOR_STEP_TO_FRIENDLY_NAME[majorDeploymentStep]} Deployment`}
                    </DialogTitle>

                    <DialogDescription className="flex flex-col justify-center text-xl items-center gap-4 p-10">
                        {result ? (
                            <Check size={64} className="text-violet-500" />
                        ) : error ? (
                            <TriangleAlert size={64} className="text-red-500" />
                        ) : (
                            <Loader size={64} className="animate-spin" />
                        )}
                        {result ? (
                            <>
                            <span>
                                Deployment of the building and its parts was successful!
                                <br />
                                One step remains to be done - you need to add&nbsp;
                                <Link
                                    className="underline font-semibold"
                                    href={`/building/${result.buildingAddress}/liquidity`}
                                >
                                    liquidity
                                </Link>
                            </span>
                            </>
                        ) : error ? (
                            ERROR_TO_DESCRIPTION[error]
                        ) : (
                            MINOR_STEP_TO_FRIENDLY_NAME[majorDeploymentStep][minorDeploymentStep]
                        )}
                    </DialogDescription>
                </DialogHeader>
                </DialogContent>
            </Dialog> **/}
        </div>
    );
}
