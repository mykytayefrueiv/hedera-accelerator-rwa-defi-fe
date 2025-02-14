import { CreateSliceRequestBody } from "@/types/erc3643/types";
import { Formik, Field, Form } from "formik"
import React from "react";
import { Button } from "react-daisyui";

const initialValues = {
    name: '',
    description: '',
    allocation: 0,
};

type Props = {
    isLoading: boolean;
    children: React.ReactElement;
    submitCreateSlice: (data: CreateSliceRequestBody) => void;
};

export const DeploySliceForm = ({ submitCreateSlice, isLoading, children }: Props) => {
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={submitCreateSlice}
        >
            <Form className="space-y-4">
                <div>
                    <label className="block text-md font-semibold text-purple-400">Name</label>
                    <Field
                        name="name"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. 1"

                    />
                </div>
                <div>
                    <label className="block text-md font-semibold text-purple-400">Description</label>
                    <Field
                        name="description"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. 1"
                    />
                </div>
                <div>
                    <label className="block text-md font-semibold text-purple-400">Allocation (%)</label>
                    <Field
                        name="allocation"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. 1"
                    />
                </div>
                {children}
                <Button
                    className="pr-20 pl-20"
                    type="submit"
                    color="primary"
                    loading={isLoading}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Slice...' : 'Submit'}
                </Button>
            </Form>
        </Formik>
    );
};
