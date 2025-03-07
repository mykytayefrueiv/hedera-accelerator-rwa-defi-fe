import React, { type FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
<<<<<<< HEAD:packages/fe-tw/src/components/Cope/CopeModal.tsx
import type { CopeData } from "@/types/cope";
import { addAuditRecord } from "@/services/auditRegistryService";
import { uploadJsonToPinata } from "@/services/ipfsService";

interface CopeModalProps {
	buildingAddress: string;
	existingData?: CopeData;
	onClose: () => void;
}

export function CopeModal({
	buildingAddress,
	existingData = {},
	onClose,
}: CopeModalProps) {
	const { writeContract } = useWriteContract();
	const [isSubmitting, setIsSubmitting] = useState(false);
=======
import { AuditData } from "@/consts/audit";
import { addAuditRecord } from "@/services/auditRegistryService";
import { uploadJsonToPinata } from "@/services/ipfsService";

interface AuditModalProps {
  buildingAddress: string; 
  existingData?: AuditData;
  onClose: () => void;
}

export function AuditModal({
  buildingAddress,
  existingData = {},
  onClose
}: AuditModalProps) {
  const { writeContract } = useWriteContract();
  const [isSubmitting, setIsSubmitting] = useState(false);
>>>>>>> main:packages/fe-tw/src/components/Audit/AuditModal.tsx

	const [insuranceProvider, setInsuranceProvider] = useState(
		existingData.insuranceProvider ?? "",
	);
	const [coverageAmount, setCoverageAmount] = useState(
		existingData.coverageAmount ?? "",
	);
	const [coverageStart, setCoverageStart] = useState(
		existingData.coverageStart ?? "",
	);
	const [coverageEnd, setCoverageEnd] = useState(
		existingData.coverageEnd ?? "",
	);
	const [notes, setNotes] = useState(existingData.notes ?? "");

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setIsSubmitting(true);

<<<<<<< HEAD:packages/fe-tw/src/components/Cope/CopeModal.tsx
		try {
			const copeData: CopeData = {
				insuranceProvider,
				coverageAmount,
				coverageStart,
				coverageEnd,
				notes,
			};

			const fileName = `building-${buildingAddress}-cope-${Date.now()}`;
			const ipfsHash = await uploadJsonToPinata(copeData, fileName);

			await addAuditRecord(writeContract, buildingAddress, ipfsHash);
			toast.success(
				`Created COPE audit record for building ${buildingAddress}`,
			);
			onClose();
		} catch (err) {
			console.error(err);
			toast.error("Failed to add COPE record");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-xl relative">
				<button
					className="btn btn-sm btn-circle absolute right-2 top-2"
					onClick={onClose}
				>
					✕
				</button>
				<h3 className="font-bold text-lg">
					Add COPE Data for {buildingAddress}
				</h3>
				<form onSubmit={handleSubmit} className="space-y-4 mt-4">
					{/* Insurance Provider */}
					<div>
						<label className="block mb-1 font-semibold">
							Insurance Provider
						</label>
						<input
							className="input input-bordered w-full"
							type="text"
							value={insuranceProvider}
							onChange={(e) => setInsuranceProvider(e.target.value)}
							required
						/>
					</div>
=======
    try {
      const AuditData: AuditData = {
        insuranceProvider,
        coverageAmount,
        coverageStart,
        coverageEnd,
        notes,
      };

      const fileName = `building-${buildingAddress}-Audit-${Date.now()}`;
      const ipfsHash = await uploadJsonToPinata(AuditData, fileName);

      await addAuditRecord(writeContract, buildingAddress, ipfsHash);
      toast.success(`Created Audit audit record for building ${buildingAddress}`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add Audit record");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-xl relative">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">Add Audit Data for {buildingAddress}</h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Insurance Provider */}
          <div>
            <label className="block mb-1 font-semibold">Insurance Provider</label>
            <input
              className="input input-bordered w-full"
              type="text"
              value={insuranceProvider}
              onChange={(e) => setInsuranceProvider(e.target.value)}
              required
            />
          </div>
>>>>>>> main:packages/fe-tw/src/components/Audit/AuditModal.tsx

					{/* Coverage Amount */}
					<div>
						<label className="block mb-1 font-semibold">Coverage Amount</label>
						<input
							className="input input-bordered w-full"
							type="text"
							value={coverageAmount}
							onChange={(e) => setCoverageAmount(e.target.value)}
							required
						/>
					</div>

					{/* Coverage Start */}
					<div>
						<label className="block mb-1 font-semibold">Coverage Start</label>
						<input
							className="input input-bordered w-full"
							type="date"
							value={coverageStart}
							onChange={(e) => setCoverageStart(e.target.value)}
							required
						/>
					</div>

					{/* Coverage End */}
					<div>
						<label className="block mb-1 font-semibold">Coverage End</label>
						<input
							className="input input-bordered w-full"
							type="date"
							value={coverageEnd}
							onChange={(e) => setCoverageEnd(e.target.value)}
							required
						/>
					</div>

					{/* Notes */}
					<div>
						<label className="block mb-1 font-semibold">Notes</label>
						<textarea
							className="textarea textarea-bordered w-full"
							rows={3}
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
						/>
					</div>

<<<<<<< HEAD:packages/fe-tw/src/components/Cope/CopeModal.tsx
					<button
						type="submit"
						className="btn btn-primary w-full"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Saving..." : "Save COPE Data"}
					</button>
				</form>
			</div>
		</div>
	);
=======
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Audit Data"}
          </button>
        </form>
      </div>
    </div>
  );
>>>>>>> main:packages/fe-tw/src/components/Audit/AuditModal.tsx
}
