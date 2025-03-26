"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Select, { SingleValue } from "react-select";
import { Formik, Form, Field } from "formik";
import { BackButton } from "@/components/Buttons/BackButton";
import { useBuildingLiquidity } from "@/hooks/useBuildingLiquidity";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import { useBuildings } from "@/hooks/useBuildings";
import { colourStyles } from "@/consts/theme";
import { USDC_ADDRESS } from "@/services/contracts/addresses";

type Props = {
  buildingAddress?: `0x${string}`;
  onGetDeployBuildingTokenView: () => void;
  onGetDeployATokenView?: () => void;
};

export function AddBuildingTokenLiquidityForm({
  onGetDeployBuildingTokenView,
  onGetDeployATokenView,
  buildingAddress,
}: Props) {
  const { buildings } = useBuildings();
  const { isAddingLiquidity, txHash, txError, addLiquidity } =
    useBuildingLiquidity();
  const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>();
  const address = buildingAddress || selectedBuildingAddress;
  const { deployedBuildingTokens } = useBuildingDetails(address);
  console.log('deployedBuildingTokens', deployedBuildingTokens);

  async function handleSubmit(
    values: {
      buildingAddress: string;
      tokenBAddress: string;
      tokenAAddress: string;
      tokenAAmount: string;
      tokenBAmount: string;
    },
    actions: { resetForm: () => void },
  ) {
    const {
      buildingAddress: buildingAddressValue,
      tokenAAddress,
      tokenBAddress,
      tokenAAmount,
      tokenBAmount,
    } = values;
    const buildingAddressOneOf = address || buildingAddressValue;

    if (
      !buildingAddressOneOf ||
      !tokenAAddress ||
      !tokenBAddress ||
      !tokenAAmount ||
      !tokenBAmount
    ) {
      toast.error("All fields are required.");
      return;
    }

    await addLiquidity({
      buildingAddress: buildingAddressOneOf,
      tokenAAddress,
      tokenBAddress,
      tokenAAmount,
      tokenBAmount,
    });

    actions.resetForm();
  }

  const tokenSelectOptions = useMemo(
    () => [
      ...deployedBuildingTokens.map((token) => ({
        value: token.tokenAddress,
        label: token.tokenAddress,
      })),
    ],
    [deployedBuildingTokens],
  );

  const buildingSelectOptions = useMemo(() => {
    return buildings.map((building) => ({
      value: building.address as `0x${string}`,
      label: building.title,
    }));
  }, [buildings?.length]);

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-300">
      <BackButton
        onHandlePress={() => {
          onGetDeployBuildingTokenView();
        }}
      />

      <h3 className="text-xl font-semibold mt-5 mb-5">
        Add Liquidity for Building Tokens
      </h3>

      <Formik
        initialValues={{
          buildingAddress: "",
          tokenAAddress: "",
          tokenBAddress: USDC_ADDRESS,
          tokenAAmount: "",
          tokenBAmount: "",
        }}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-4">
            {/* Building */}

            {!buildingAddress && (
              <div>
                <label className="block text-md font-semibold text-purple-400">
                  Select Building Address
                </label>
                <Select
                  styles={colourStyles}
                  className="mt-2"
                  placeholder="Building Address"
                  options={buildingSelectOptions}
                  onChange={(
                    option: SingleValue<{ value: string; label: string }>,
                  ) => {
                    setFieldValue("buildingAddress", option?.value as `0x${string}`);
                    setSelectedBuildingAddress(option?.value as `0x${string}`);
                  }}
                  value={buildingSelectOptions.find(
                    (opt) => opt.value === values.buildingAddress,
                  )}
                />
              </div>
            )}

            {/* Token A */}
            <div>
              <label className="block text-md font-semibold text-purple-400">
                Select Token A
              </label>
              <Select
                styles={colourStyles}
                className="mt-2"
                placeholder="Pick Token A"
                options={tokenSelectOptions}
                onChange={(
                  option: SingleValue<{ value: string; label: string }>,
                ) => {
                  setFieldValue("tokenAAddress", option?.value || "");
                }}
                value={
                  values.tokenAAddress
                    ? {
                        value: values.tokenAAddress,
                        label:
                          tokenSelectOptions.find(
                            (t) => t.value === values.tokenAAddress,
                          )?.label || values.tokenAAddress,
                      }
                    : null
                }
              />
            </div>
            <div>
              <label className="block text-md font-semibold text-purple-400">
                Token A Amount
              </label>
              <Field
                name="tokenAAmount"
                className="input input-bordered w-full mt-2"
                placeholder="e.g. 100"
              />
            </div>

            {/* Token B */}
            <div>
              <label className="block text-md font-semibold text-purple-400">
                Select Token B
              </label>
              <Select
                styles={colourStyles}
                className="mt-2"
                placeholder="Pick Token B"
                options={[
                  {
                    value: USDC_ADDRESS,
                    label: "USDC",
                  }
                ]}
                onChange={(
                  option: SingleValue<{ value: string; label: string }>,
                ) => {
                  setFieldValue("tokenBAddress", option?.value || "");
                }}
                value={{
                  value: USDC_ADDRESS,
                  label: "USDC",
                }}
                isDisabled
              />
            </div>
            <div>
              <label className="block text-md font-semibold text-purple-400">
                Token B Amount
              </label>
              <Field
                name="tokenBAmount"
                className="input input-bordered w-full mt-2"
                placeholder="e.g. 100"
              />
            </div>

            <div className="flex gap-5 mt-5">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isAddingLiquidity}
              >
                {isAddingLiquidity ? (
                  <>
                    <span className="loading loading-spinner" />
                    Adding Liquidity...
                  </>
                ) : (
                  "Add Liquidity"
                )}
              </button>
              {!!onGetDeployATokenView && <button
                className="btn btn-primary"
                type="button"
                onClick={() => onGetDeployATokenView()}
              >
                Deploy Vault and Compounder
              </button>}
            </div>
          </Form>
        )}
      </Formik>

      {txHash && (
        <div className="mt-4">
          <span className="text-xs text-purple-600">
            Add Liquidity Success, Tx Hash: {txHash}
          </span>
        </div>
      )}
      {txError && (
        <div className="mt-4" style={{ maxWidth: 200 }}>
          <span className="text-xs text-purple-600">
            Add Liquidity Tx Error: {txError}
          </span>
        </div>
      )}
    </div>
  );
}
