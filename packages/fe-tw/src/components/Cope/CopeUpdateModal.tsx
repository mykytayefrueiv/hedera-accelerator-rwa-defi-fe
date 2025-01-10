"use client";

import { FormEvent, useState } from "react";
import type { CopeData } from "@/consts/cope";

type CopeUpdateModalProps = {
  data: CopeData;
  onUpdate: (updatedData: Partial<CopeData>) => void;
  onClose: () => void;
  isUpdating: boolean;
};

export function CopeUpdateModal({
  data,
  onUpdate,
  onClose,
  isUpdating,
}: CopeUpdateModalProps) {
  const [insuranceProvider, setInsuranceProvider] = useState(data.insuranceProvider || "");
  const [coverageAmount, setCoverageAmount] = useState(data.coverageAmount || "");
  const [coverageStart, setCoverageStart] = useState(data.coverageStart || "");
  const [coverageEnd, setCoverageEnd] = useState(data.coverageEnd || "");
  const [notes, setNotes] = useState(data.notes || "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onUpdate({
      insuranceProvider,
      coverageAmount,
      coverageStart,
      coverageEnd,
      notes,
    });
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-md">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-4">Update COPE Metadata</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="insuranceProvider">
              Insurance Provider
            </label>
            <input
              id="insuranceProvider"
              type="text"
              value={insuranceProvider}
              onChange={(e) => setInsuranceProvider(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="coverageAmount">
              Coverage Amount
            </label>
            <input
              id="coverageAmount"
              type="text"
              value={coverageAmount}
              onChange={(e) => setCoverageAmount(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="coverageStart">
              Coverage Start
            </label>
            <input
              id="coverageStart"
              type="date"
              value={coverageStart}
              onChange={(e) => setCoverageStart(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="coverageEnd">
              Coverage End
            </label>
            <input
              id="coverageEnd"
              type="date"
              value={coverageEnd}
              onChange={(e) => setCoverageEnd(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="notes">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              className="textarea textarea-bordered w-full"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
