import { CreateSliceRequestBody } from "@/types/erc3643/types";
import { Formik, Field, Form, ErrorMessage } from "formik"
import React from "react";
import { Button } from "react-daisyui";
import { UploadImageForm } from "@/components/Account/UploadImageForm";

const initialValues = {
    name: '',
    description: '',
    endDate: '',
    sliceImageIpfsHashId: '',
    symbol: '',
};

type Props = {
    isLoading: boolean;
    children: React.ReactElement;
    getSliceAllocationForm: () => void;
    submitCreateSlice: (data: CreateSliceRequestBody) => void;
};

export const AddSliceForm = ({ submitCreateSlice, getSliceAllocationForm, isLoading, children }: Props) => {
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={submitCreateSlice}
        >
             {({ setFieldValue }) => (
            <Form className="space-y-4">
                <div>
                    <label className="block text-md font-semibold text-purple-400">Slice Name</label>
                    <Field
                        name="name"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. Corgi Condominium"
                    />
                </div>
                <div>
                    <label className="block text-md font-semibold text-purple-400">Slice Symbol</label>
                    <Field
                        name="symbol"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. CORGI_S"
                    />
                </div>
                <div>
                    <label className="block text-md font-semibold text-purple-400">Slice Description</label>
                    <Field
                        name="description"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. Corgi Condominium Seria's"
                    />
                </div>
                <div>
                    <label className="block text-md font-semibold text-purple-400">Slice End Date</label>
                    <Field
                        name="endDate"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. 10.10.2025"
                        type="date"
                    />
                </div>
                <div>
                    <label className="block text-md font-semibold text-purple-400" htmlFor="sliceImageIpfsHashId">
                        Slice Image IPFS Hash
                    </label>
                    <ErrorMessage name="sliceImageIpfsHashId">
						{(error) => (
							<span className="label-text-alt text-red-700">{error}</span>
					    )}
				   </ErrorMessage>
					<Field
						name="sliceImageIpfsHashId"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. 1223232323ccc2323"
                    />
                    <UploadImageForm
                        fileHashName="sliceImageIpfsFile"
                        fileHashId="sliceImageIpfsHashId"
                        onFileUploaded={(file, cid) => {
                            setFieldValue("sliceImageIpfsFile", file);
                            setFieldValue("sliceImageIpfsHashId", cid);
                        }}
                    />
                </div>
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
                        {isLoading ? 'Slice Creating...' : 'Add Allocation'}
                    </Button>
                </div>
            </Form>
            )}
        </Formik>
    );
};
