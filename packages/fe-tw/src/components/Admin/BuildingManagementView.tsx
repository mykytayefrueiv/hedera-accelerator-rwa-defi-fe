"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export function BuildingManagementView() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    tokenSupply: 1000000,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mock API Call
      toast.success("Building added successfully");
      setFormData({ name: "", location: "", tokenSupply: 1000000 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add building");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Description */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">What You Can Do</h2>
          <p className="text-sm sm:text-base text-gray-700">
            This interface allows you to manage buildings by adding new ones to the platform.
          </p>
          <p className="mt-4 text-sm sm:text-base text-gray-700">
            To add a building, fill in the form with the building's name, location, and token supply. Once submitted, the building will be added to the system.
          </p>
        </div>

        {/* Right Column: Building Management Form */}
        <div className="bg-white rounded-lg p-8 border border-gray-300">
          <h2 className="text-xl font-semibold mb-6">Add Building</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Building Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter building name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter location"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Token Supply</label>
              <input
                type="number"
                name="tokenSupply"
                value={formData.tokenSupply}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter token supply"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Add Building
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
