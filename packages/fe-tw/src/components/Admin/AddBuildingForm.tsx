"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface AddBuildingFormProps {
}

export function AddBuildingForm() {
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
      toast.success("Building added successfully!");
      setFormData({ name: "", location: "", tokenSupply: 1000000 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add building");
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-300">
      <h3 className="text-xl font-semibold mb-4">Add Building</h3>
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
        <button type="submit" className="btn btn-primary w-full">
          Add Building
        </button>
      </form>
    </div>
  );
}
