import { CreateERC3643TokenPayload, useBuildingAdmin } from "@/hooks/useBuildingAdmin";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { Button } from "react-daisyui";
import * as Yup from "yup";

type Props = {
    buildingAddress: `0x${string}`;
}

const initialValues = {
    tokenName: '',
    tokenSymbol: '',
};

export const DeployERC3643TokenForm = ({ buildingAddress }: Props) => {
    const { createBuildingERC3643Token, createNewBuilding } = useBuildingAdmin(buildingAddress);
    const [txError, setTxError] = useState<string>();
    const [txResult, setTxResult] = useState<string>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: CreateERC3643TokenPayload) => {
        setLoading(true);

        try {
            const tx = await createBuildingERC3643Token(values);
            setTxResult(tx);
        } catch (err) {
            setTxError('Deploy of building token failed!');
        }

        setLoading(false);
    };

    return (
        <>
            {/** <div className="p-5">
                <Button
                    type="submit"
                    color="primary"
                    loading={loading}
                    disabled={loading}
                    onClick={async () => {
                        await createNewBuilding('ipfs://bafkreifuy6zkjpyqu5ygirxhejoryt6i4orzjynn6fawbzsuzofpdgqscq')
                    }}
                >
                    Deploy new Building
                </Button>
            </div> **/}
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object({
                    tokenName: Yup.string().required("Required"),
                    tokenSymbol: Yup.string().required("Required"),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    handleSubmit(values);
                    setSubmitting(false);
                }}>
                <Form className="p-5">
                    <div className="w-full">
                        <label className="label" htmlFor="tokenName">ERC3643 Token Name</label>
                        <Field
                            name="tokenName"
                            type="text"
                            className="input input-bordered w-6/12"
                            placeholder="E.g: 0x"
                        />
                    </div>
                    <div className="w-full">
                        <label className="label" htmlFor="tokenSymbol">ERC3643 Token Symbol</label>
                        <Field
                            name="tokenSymbol"
                            type="text"
                            className="input input-bordered w-6/12"
                            placeholder="E.g: TOK"
                        />
                    </div>
                    <Button
                        className="mt-5"
                        type="submit"
                        color="primary"
                        loading={loading}
                        disabled={loading}
                    >
                        Deploy ERC3643 Token
                    </Button>
                    {txResult && <div className="flex mt-5">
                        <p className="text-sm font-bold text-purple-600">
                            Deployed Tx Hash: {txResult}
                        </p>
                    </div>}
                    {txError && <div className="flex mt-5">
                        <p className="text-sm font-bold text-purple-600">
                            Deployed Tx Error: {txError}
                        </p>
                    </div>}
                </Form>
            </Formik>
        </>
    );
};
