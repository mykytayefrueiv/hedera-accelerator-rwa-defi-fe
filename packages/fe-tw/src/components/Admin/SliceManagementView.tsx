"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCreateSlice } from "@/hooks/useCreateSlice";
import { CreateSliceRequestBody } from "@/types/erc3643/types";
import { DeploySliceForm } from "./DeploySliceForm";

export function SliceManagementView() {
  const [txResult, setTxResult] = useState<string>();
  const [txError, setTxError] = useState<string>();
  const [isTransactionInProgress, setIsTransactionInProgress] = useState<boolean>(false);

  const { handleCreateSlice } = useCreateSlice();

  const onHandleSubmit = async (values: CreateSliceRequestBody) => {
    try {
      setIsTransactionInProgress(true);
      const txOrHash = await handleCreateSlice(values);

      toast.success("Slice created successfully");
      setTxResult(txOrHash);
    } catch (err) {
      setIsTransactionInProgress(false);
      setTxError((err as unknown as { message: string }).message?.slice(0, 28));
    }
  };

  return (
    <div className="p-6 max-w-8xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Description */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">What You Can Do</h2>
          <p className="text-sm sm:text-base text-gray-700">
            Manage slices by creating and defining allocations. Slices help automate portfolio management by maintaining predefined allocations across assets.
          </p>
          <p className="mt-4 text-sm sm:text-base text-gray-700">
            To create a slice, provide a name, a description, and define its allocations. This will streamline asset management for your portfolio.
          </p>
        </div>

        {/* Right Column: Slice Management Form */}
        <div className="bg-white rounded-lg p-8 border border-gray-300">
          <h2 className="text-xl font-semibold mb-6">Create Slice</h2>
          <DeploySliceForm
            isLoading={isTransactionInProgress}
            submitCreateSlice={onHandleSubmit}
          >
            <>
              {txResult && <div className="flex">
                <p className="text-sm font-bold text-purple-600">
                  Deployed Tx Hash: {txResult}
                </p>
              </div>}
              {txError && <div className="flex">
                <p className="text-sm font-bold text-purple-600">
                  Deployed Tx Error: {txError}
                </p>
              </div>}
            </>
          </DeploySliceForm>
        </div>
      </div>
    </div>
  );
}
