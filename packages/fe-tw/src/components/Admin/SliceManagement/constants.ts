import { StepsStatus } from "../buildingManagement/types";
import * as Yup from "yup";

export type CreateSliceFormProps = {
    name: string,
    description: string,
    endDate: string,
    sliceImageIpfsHash: string,
    symbol: string,
};

export type AddSliceAllocationFormProps = {
    tokenAsset: string,
    allocation: string,
};

export const addAllocationFormInitialValues = {
    tokenAsset: "",
    allocation: "",
};

export const deploySliceFormInitialValues = {
    name: "",
    description: "",
    endDate: "",
    sliceImageIpfsHash: "",
    symbol: "",
};

export const INITIAL_VALUES = {
    slice: deploySliceFormInitialValues,
    sliceAllocation: addAllocationFormInitialValues,
};

export const VALIDATION_SCHEMA = {
    slice: Yup.object().shape({
        name: Yup.string(),
        description: Yup.string(),
        endDate: Yup.string(),
        sliceImageIpfsHash: Yup.string(),
        symbol: Yup.string(),
    }),
    sliceAllocation: Yup.object().shape({
        tokenAsset: Yup.string(),
        allocation: Yup.string(),
    }),
};

export const STEPS = ["slice", "sliceAllocation"];

export const FRIENDLY_STEP_NAME = {
   slice: "Slice",
   sliceAllocation: "Add Slice Allocation",
};

export const FRIENDLY_STEP_STATUS: Record<StepsStatus, string> = {
   [StepsStatus.NOT_STARTED]: "Not Started",
   [StepsStatus.IN_PROGRESS]: "In Progress",
   [StepsStatus.VALID]: "Valid",
   [StepsStatus.INVALID]: "Invalid",
   [StepsStatus.DEPLOYED]: "Deployed",
};
