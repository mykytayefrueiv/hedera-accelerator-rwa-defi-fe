"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCreateSlice } from "@/hooks/useCreateSlice";

export function SliceManagementView() {
  const [txResult, setTxResult] = useState<string>();
  const [txError, setTxError] = useState<string>();
  const [formData, setFormData] = useState({
    sliceName: "",
    allocation: "",
    description: "",
  });

  const { handleCreateSlice } = useCreateSlice();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // TODO: endpoint to push / get slice metadata.
      const txOrHash = await handleCreateSlice();
      setTxResult((txOrHash as { transaction_hash: string })?.transaction_hash);
      toast.success("Slice created successfully");

      setFormData({ sliceName: "", allocation: "", description: "" });
    } catch (err) {
      setTxError((err as unknown as { message: string }).message?.slice(0, 28));
      toast.error("Failed to create slice");
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Slice Name</label>
              <input
                type="text"
                name="sliceName"
                value={formData.sliceName}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter slice name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Allocation (%)</label>
              <input
                type="text"
                name="allocation"
                value={formData.allocation}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter allocation percentages"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full"
                placeholder="Enter a brief description"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full md:w-4/12"
            >
              Create Slice
            </button>
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
          </form>
        </div>
      </div>
    </div>
  );
}
