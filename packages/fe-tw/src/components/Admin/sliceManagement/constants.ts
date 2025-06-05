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
    depositAmount?: string,
    rewardAmount?: string,
    allocationAmount?: string,
};

export type DepositSliceFormProps = {
    amount: string,
    token: string,
};

export const addAllocationFormInitialValues = {
    tokenAssets: [],
    tokenAssetAmounts: {},
    depositAmount: "0",
    rewardAmount: "0",
    allocationAmount: "0",
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
};

const validateAmountField = (val: any, fieldName: string) => val.when('tokenAssets', ([tokenAssets]: string[][], schema: Yup.Schema) => {
    return schema.test(
        `total_${fieldName}_amount`, `${fieldName} amount can't be empty and > 100`,
        (value: string) => tokenAssets?.length > 0 ? !!Number(value) && Number(value) >= 100 : true
    )
});

const validateAssetsField = (val: any) => val.when('allocationAmount', ([allocationAmount]: string[][], schema: Yup.Schema) => {
    return schema.test(
        'token_assets', 'Minimum amount of assets for allocation is 2',
        (value: string) => value?.length > 0 ? value?.length >=2 : true
    )
});

export const VALIDATION_SCHEMA = Yup.object({
    slice: Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        endDate: Yup.string().when('tokenAssets', ([_tokenAssets]: string[][], schema: Yup.Schema) => {
            return schema.test('incoming_date', 'Should be incoming date', (value?: string) => {
                if (!value) {
                    return true;
                }

                const endDate = new Date(value);

                return endDate > new Date();
            })
        }),
        sliceImageIpfsHash: Yup.string().required('Image is required'),
        symbol: Yup.string().required('Symbol is required'),
    }),
    sliceAllocation: Yup.object().shape({
        tokenAssets: validateAssetsField(Yup.array().of(Yup.string())),
        tokenAssetAmounts: Yup.object(),
        depositAmount: validateAmountField(Yup.string(), 'deposit'),
        rewardAmount: validateAmountField(Yup.string(), 'reward'),
        allocationAmount: Yup.string(),
    }),
});

export const STEPS = ["slice", "sliceAllocation"];

export const FRIENDLY_STEP_NAME = {
   slice: "Deploy Slice",
   sliceAllocation: "Add Slice Allocations",
};

export const FRIENDLY_STEP_STATUS: Record<StepsStatus, string> = {
   [StepsStatus.NOT_STARTED]: "Not Started",
   [StepsStatus.IN_PROGRESS]: "In Progress",
   [StepsStatus.VALID]: "Valid",
   [StepsStatus.INVALID]: "Invalid",
   [StepsStatus.DEPLOYED]: "Deployed",
};
