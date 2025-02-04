import { useBuildingAdmin } from "@/hooks/useBuildingAdmin";
import { useBuildings } from "@/hooks/useBuildings";
import { CreateERC3643RequestBody } from "@/types/erc3643/types";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { Button } from "react-daisyui";
import Select from "react-select";
import * as Yup from "yup";

type Props = {
    buildingAddress?: `0x${string}`;
    onGetLiquidityView: (address: `0x${string}`) => void;
}

const initialValues = {
    tokenName: '',
    tokenSymbol: '',
    tokenDecimals: 18,
};

const colourStyles = {
    control: (styles: object) => ({ ...styles, paddingTop: 6, paddingBottom: 6, borderRadius: 8, backgroundColor: "#fff" }),
    option: (styles: any) => ({
        ...styles,
        backgroundColor: "#fff",
        color: "#000",
        ":active": {
            ...styles[":active"],
            backgroundColor: "#9333ea36",
        },
        ":focused": {
            backgroundColor: "#9333ea36",
        },
    }),
};

export const DeployBuildingERC3643TokenForm = ({ buildingAddress, onGetLiquidityView }: Props) => {
    const { buildings } = useBuildings();
    const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>('0x');

    const [txError, setTxError] = useState<string>();
    const [txResult, setTxResult] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [deployedTokens, setDeployedTokens] = useState<`0x${string}`[]>([]);

    const { createBuildingERC3643Token } = useBuildingAdmin(buildingAddress ?? selectedBuildingAddress);

    const handleSubmit = async (values: CreateERC3643RequestBody) => {
        setLoading(true);

        try {
            const tx = await createBuildingERC3643Token(values);
            setTxResult(tx);
        } catch (err) {
            setTxError('Deploy of building token failed!');
        }

        setDeployedTokens((prev) => [...prev, '0x123']);
        setLoading(false);
    };

    return (
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
            <Form className="p-5 space-y-4 p-8 border border-gray-300">
                {!buildingAddress && (
                    <div className="w-full">
                        <label className="block text-md font-semibold text-purple-400" htmlFor="tokenName">
                            Select Building Address
                        </label>
                        <Select
                            className="mt-2"
                            placeholder="Building Address"
                            name="buildingAddress"
                            onChange={(option) => {
                                setSelectedBuildingAddress(option?.value ?? '0x');
                            }}
                            options={buildings.map((building) => ({
                                value: building.address,
                                label: building.title,
                            }))}
                            styles={colourStyles}
                        />
                    </div>
                )}
                <div className="w-full">
                    <label className="block text-md font-semibold text-purple-400" htmlFor="tokenName">
                        ERC3643 Token Name
                    </label>
                    <Field
                        name="tokenName"
                        type="text"
                        className="input input-bordered w-full mt-2"
                        placeholder="E.g: 0x"
                    />
                </div>
                <div className="w-full">
                    <label className="block text-md font-semibold text-purple-400" htmlFor="tokenSymbol">
                        ERC3643 Token Symbol
                    </label>
                    <Field
                        name="tokenSymbol"
                        type="text"
                        className="input input-bordered w-full mt-2"
                        placeholder="E.g: TOK"
                    />
                </div>
                <div className="w-full">
                    <label className="block text-md font-semibold text-purple-400" htmlFor="tokenDecimals">
                        ERC3643 Token Decimals
                    </label>
                    <Field
                        name="tokenDecimals"
                        type="number"
                        className="input input-bordered w-full mt-2"
                        placeholder="E.g: TOK"
                    />
                </div>
                <div className="flex gap-5">
                    <Button
                        className="mt-5"
                        type="submit"
                        color="primary"
                        loading={loading}
                        disabled={loading}
                    >
                        Deploy ERC3643 Token
                    </Button>
                    <Button
                        className="mt-5 pr-10 pl-10"
                        type="button"
                        color="secondary"
                        onClick={() => onGetLiquidityView(selectedBuildingAddress)}
                        disabled={deployedTokens.length === 0}
                    >
                        To Add Luquidity
                    </Button>
                </div>
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
    );
};
