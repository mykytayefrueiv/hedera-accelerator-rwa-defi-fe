"use client";

import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { useBuildingLiquidity } from "@/hooks/useBuildingLiquidity";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import { BuildingData } from "@/types/erc3643/types";

type Props = {
  buildingAddress: `0x${string}`;
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

export function AddLiquidityForm({ buildingAddress }: Props) {
  const [formData, setFormData] = useState({
    buildingAddress: (buildingAddress as string) ?? "",
    tokenAAddress: "",
    tokenBAddress: "",
    tokenAAmount: "100",
    tokenBAmount: "1",
  });

  const { isAddingLiquidity, txHash, txError, addLiquidity } = useBuildingLiquidity();
  const { deployedBuildingTokens } = useBuildingDetails({ address: buildingAddress } as BuildingData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLiquidity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.buildingAddress ||
      !formData.tokenAAddress ||
      !formData.tokenBAddress ||
      !formData.tokenAAmount ||
      !formData.tokenBAmount
    ) {
      toast.error("All fields are required.");
      return;
    }

    await addLiquidity({
      buildingAddress: formData.buildingAddress,
      tokenAAddress: formData.tokenAAddress,
      tokenBAddress: formData.tokenBAddress,
      tokenAAmount: formData.tokenAAmount,
      tokenBAmount: formData.tokenBAmount,
    });

    setFormData({
      buildingAddress: "",
      tokenAAddress: "",
      tokenBAddress: "",
      tokenAAmount: "100",
      tokenBAmount: "1",
    });
  };

  const tokenSelectionOptions = useMemo(() => [
    ...deployedBuildingTokens.map(token => ({
      value: token.tokenAddress,
      label: token.tokenAddress, // todo: replace with token name
    })), {
      value: '0x0000000000000000000000000000000000211103',
      label: 'USDC',
    }
  ], [deployedBuildingTokens?.length]);

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-300">
      <h3 className="text-xl font-semibold mb-4">Add Liquidity</h3>
      <form onSubmit={handleAddLiquidity} className="space-y-4">
        {!buildingAddress && <div>
          <label className="block text-md font-semibold text-purple-400" htmlFor="buildingAddress">Building Address</label>
          <input
            type="text"
            name="buildingAddress"
            value={formData.buildingAddress}
            onChange={handleInputChange}
            className="input input-bordered w-full mt-2"
            placeholder="Building Address"
            required
          />
        </div>}
        <div>
          <label className="block text-md font-semibold text-purple-400 mb-2" htmlFor="tokenAAddress">Select Token A</label>
          <Select
            placeholder="Token A Address"
            onChange={(option) => {
              setFormData((prev) => ({
                ...prev,
                tokenAAddress: option?.value ?? "",
              }));
            }}
            options={tokenSelectionOptions}
            styles={colourStyles}
          />
        </div>
        <div>
          <label className="block text-md font-semibold text-purple-400" htmlFor="tokenAAmount">Token A Amount</label>
          <input
            type="text"
            name="tokenAAmount"
            value={formData.tokenAAmount}
            onChange={handleInputChange}
            className="input input-bordered w-full mt-2"
            placeholder="Token A Amount"
            required
          />
        </div>

        <div>
          <label className="block text-md font-semibold text-purple-400 mb-2" htmlFor="tokenBAddress">Select Token B</label>
          <Select
            placeholder="Token B Address"
            onChange={(option) => {
              setFormData((prev) => ({
                ...prev,
                tokenBAddress: option?.value ?? "",
              }));
            }}
            options={tokenSelectionOptions}
            styles={colourStyles}
          />
        </div>
        <div>
          <label className="block text-md font-semibold text-purple-400" htmlFor="tokenBAmount">Token B Amount</label>
          <input
            type="text"
            name="tokenBAmount"
            value={formData.tokenBAmount}
            onChange={handleInputChange}
            className="input input-bordered w-full mt-2"
            placeholder="Token B Amount"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary pr-20 pl-20"
          disabled={isAddingLiquidity}
        >
          {isAddingLiquidity ? "Adding Liquidity..." : "Add Liquidity"}
        </button>
      </form>

      {txHash && (
        <div className="mt-4 text-sm text-gray-700">
          <p className="text-sm font-bold text-purple-600">
            Deployed Tx Hash: {txHash}
          </p>
        </div>
      )}

      {txError && (
        <div className="flex mt-5">
          <p className="text-sm font-bold text-purple-600">
            Deployed Tx Error: {txError}
          </p>
        </div>
      )}
    </div>
  );
}
