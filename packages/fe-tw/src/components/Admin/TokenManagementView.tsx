"use client";

import { useState } from "react";
import { useDeployToken } from "@/hooks/erc3643/mutations/useDeployToken";
import { toast } from "react-hot-toast";

export function TokenManagementView() {
  const { mutateAsync: deployToken } = useDeployToken();
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    decimals: 18,
    complianceModules: [],
    complianceSettings: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await deployToken(formData);
      toast.success(`Token deployed! Address: ${result.tokenAddress}`);
      setFormData({
        name: "",
        symbol: "",
        decimals: 18,
        complianceModules: [],
        complianceSettings: [],
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to deploy token");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Description */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">What You Can Do</h2>
          <p className="text-sm sm:text-base text-gray-700">
            This interface allows you to deploy ERC-3643 compliant tokens.
          </p>
          <p className="mt-4 text-sm sm:text-base text-gray-700">
            To deploy a token, fill in the form with the token name, symbol, and decimal places. Once submitted, the token will be deployed on Hedera, and you'll receive the token address.
          </p>
        </div>

        {/* Right Column: Token Deployment Form */}
        <div className="bg-white rounded-lg p-8 border border-gray-300">
          <h2 className="text-xl font-semibold mb-6">Deploy Token</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Token Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Symbol</label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Decimals</label>
              <input
                type="number"
                name="decimals"
                value={formData.decimals}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Deploying..." : "Deploy Token"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
