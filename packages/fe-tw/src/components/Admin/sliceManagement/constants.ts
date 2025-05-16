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
    tokenAssets: string[],
    tokenAssetAmounts: { [key: string]: string },
    totalAssetsAmount: string,
};

export type DepositSliceFormProps = {
    amount: string,
    token: string,
};

export const addAllocationFormInitialValues = {
    tokenAssets: [],
    tokenAssetAmounts: {},
    totalAssetsAmount: "0",
};

export const deploySliceFormInitialValues = {
    name: "",
    description: "",
    endDate: "",
    sliceImageIpfsHash: "",
    symbol: "",
};

export const depositSliceFormInitialValues = {
   amount: "",
   token: "",
};

export const INITIAL_VALUES = {
    slice: deploySliceFormInitialValues,
    sliceAllocation: addAllocationFormInitialValues,
    deposit: depositSliceFormInitialValues,
};

export const VALIDATION_SCHEMA = Yup.object({
    slice: Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        endDate: Yup.string().required('End date is required'),
        sliceImageIpfsHash: Yup.string().required('Image is required'),
        symbol: Yup.string().required('Symbol is required'),
    }),
    sliceAllocation: Yup.object().shape({
        tokenAssets: Yup.array().of(Yup.string()),
        tokenAssetAmounts: Yup.object(),
        totalAssetsAmount: Yup.string().when(['sliceAllocation.tokenAssets'], (a, schema) => 
            schema.test("total_deposit_amount", "Total deposit amount should be provided", value => a.length > 0 ? Number(value) > 0 : true)
        ),
    }),
});

export const STEPS = ["slice", "sliceAllocation"];

export const FRIENDLY_STEP_NAME = {
   slice: "Deploy Slice",
   sliceAllocation: "Add Slice Allocations in tokens",
};

export const FRIENDLY_STEP_STATUS: Record<StepsStatus, string> = {
   [StepsStatus.NOT_STARTED]: "Not Started",
   [StepsStatus.IN_PROGRESS]: "In Progress",
   [StepsStatus.VALID]: "Valid",
   [StepsStatus.INVALID]: "Invalid",
   [StepsStatus.DEPLOYED]: "Deployed",
};
