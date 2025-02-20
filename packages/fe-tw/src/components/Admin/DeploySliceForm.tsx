import { CreateSliceRequestBody } from "@/types/erc3643/types";
import { Formik, Field, Form } from "formik"
import React from "react";
import { Button } from "react-daisyui";

const initialValues = {
    name: '',
    description: '',
    allocation: 0,
    endDate: '',
    imageIpfsUrl: '',
};

type Props = {
    isLoading: boolean;
    children: React.ReactElement;
    getSliceAllocationForm: () => void;
    submitCreateSlice: (data: CreateSliceRequestBody) => void;
};

export const DeploySliceForm = ({ submitCreateSlice, getSliceAllocationForm, isLoading, children }: Props) => {
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={submitCreateSlice}
        >
            <Form className="space-y-4">
                <div>
                    <label className="block text-md font-semibold text-purple-400">Slice Name</label>
                    <Field
                        name="name"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. 1"
                    />
                </div>
                <div>
                    <label className="block text-md font-semibold text-purple-400">Slice Description</label>
                    <Field
                        name="description"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. 1"
                    />
                </div>
                <div>
                    <label className="block text-md font-semibold text-purple-400">Slice Allocation (%)</label>
                    <Field
                        name="allocation"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. 1"
                    />
                </div>
                <div>
                    <label className="block text-md font-semibold text-purple-400">Slice End date</label>
                    <Field
                        name="endDate"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. 1"
                        type="date"
                    />
                </div>
                <div>
                    <label className="block text-md font-semibold text-purple-400" htmlFor="imageIpfsURL">Slice Image URL</label>
					<Field
						name="imageIpfsURL"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. /url"
					/>
                </div>
                {/** <!-- Upload image form --> (PR https://github.com/hashgraph/hedera-accelerator-rwa-re-ui/pull/45/) */}
                {children}
                <div className="flex gap-5 mt-5">
                    <Button
                        className="pr-20 pl-20"
                        type="submit"
                        color="primary"
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Slice Creating...' : 'Submit'}
                    </Button>
                    <Button
                        className="pr-10 pl-10"
                        type="button"
                        color="neutral"
                        onClick={getSliceAllocationForm}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Add Allocation
                    </Button>
                </div>
            </Form>
        </Formik>
    );
};
