import { UploadImageForm } from "@/components/Account/UploadImageForm";
import { prepareIPFSfileURL } from "@/utils/helpers";
import { pinata } from "@/utils/pinata";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "react-daisyui";
import { toast } from "react-hot-toast";
import * as Yup from "yup";

interface newBuildingFormProps {
	buildingTitle: string;
	buildingDescription?: string;
	buildingPurchaseDate?: string;
	buildingImageIpfsURL: string;
	buildingImageIpfsFile?: File;
	buildingConstructedYear?: string;
	buildingType?: string;
	buildingLocation?: string;
	buildingLocationType?: string;
	buildingCopeIpfsHash?: string;
}

const newBuildingFormInitialValues: newBuildingFormProps = {
	buildingTitle: "",
	buildingDescription: "",
	buildingPurchaseDate: "",
	buildingImageIpfsURL: "",
	buildingConstructedYear: "",
	buildingType: "",
	buildingLocation: "",
	buildingLocationType: "",
	buildingCopeIpfsHash: "",
};

interface deployBuildingMetadataProps {
	setDeployedMetadataIPFS: Dispatch<SetStateAction<string>>;
}

//@TODO preview metadata after deploy

export function DeployBuildingMetadata({
	setDeployedMetadataIPFS,
}: deployBuildingMetadataProps) {
	const [isUploading, setIsUploading] = useState(false);

	const uploadMetadata = async (formValues: newBuildingFormProps) => {
		setIsUploading(true);

		const formDataJson = {
			title: formValues.buildingTitle,
			purchasedAt: formValues.buildingPurchaseDate,
			description: formValues.buildingDescription,
			imageUrl: formValues.buildingImageIpfsURL,
			copeIpfsHash: formValues.buildingCopeIpfsHash,
			demographics: {
				constructedYear: formValues.buildingConstructedYear,
				type: formValues.buildingType,
				location: formValues.buildingLocation,
				locationType: formValues.buildingLocationType,
			},
		};

		try {
			const keyRequest = await fetch("/api/pinataKey");
			const keyData = await keyRequest.json();
			const upload = await pinata.upload.json(formDataJson).key(keyData.JWT);

			const ipfsURL = prepareIPFSfileURL(upload.IpfsHash);

			setDeployedMetadataIPFS(ipfsURL);
			setIsUploading(false);
		} catch (e) {
			toast.error("Metadata JSON upload to IPFS failed");
			setIsUploading(false);
		}
	};

	return (
		<>
			<h3>Add building metadata details</h3>

			<Formik
				initialValues={newBuildingFormInitialValues}
				//@TODO add validation
				validationSchema={Yup.object({
					buildingTitle: Yup.string().required("Required"),
				})}
				onSubmit={async (values, { setSubmitting }) => {
					setSubmitting(true);

					await uploadMetadata(values);

					setSubmitting(false);
				}}
			>
				<Form>
					<div className="form-control w-full max-w-xs">
						<label className="label" htmlFor="buildingTitle">
							<span className="label-text">Building title</span>
						</label>
						<Field
							name="buildingTitle"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingTitle">
							<ErrorMessage name="buildingTitle">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingDescription">
							<span className="label-text">Building description</span>
						</label>

						<Field
							as={"textarea"}
							name="buildingDescription"
							type="textarea"
							className="textarea textarea-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingDescription">
							<ErrorMessage name="buildingDescription">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingPurchaseDate">
							<span className="label-text">Building purchase date</span>
						</label>
						<Field
							name="buildingPurchaseDate"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingPurchaseDate">
							<ErrorMessage name="buildingPurchaseDate">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingImageIpfsURL">
							<span className="label-text">Building image IPFS URL</span>
						</label>
						<Field
							name="buildingImageIpfsURL"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingImageIpfsURL">
							<ErrorMessage name="buildingImageIpfsURL">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<UploadImageForm />

						<label className="label" htmlFor="buildingConstructedYear">
							<span className="label-text">Building year of construction</span>
						</label>
						<Field
							name="buildingConstructedYear"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingConstructedYear">
							<ErrorMessage name="buildingConstructedYear">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingType">
							<span className="label-text">Building type</span>
						</label>
						<Field
							name="buildingType"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingType">
							<ErrorMessage name="buildingType">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingLocation">
							<span className="label-text">Building location</span>
						</label>
						<Field
							name="buildingLocation"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingLocation">
							<ErrorMessage name="buildingLocation">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingLocationType">
							<span className="label-text">Building location type</span>
						</label>
						<Field
							name="buildingLocationType"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingLocationType">
							<ErrorMessage name="buildingLocationType">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingCopeIpfsHash">
							<span className="label-text">Building COPE IPFS hash</span>
						</label>
						<Field
							name="buildingCopeIpfsHash"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingCopeIpfsHash">
							<ErrorMessage name="buildingCopeIpfsHash">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<Button
							type={"submit"}
							color={"primary"}
							loading={isUploading}
							disabled={isUploading}
						>
							Submit building metadata
						</Button>
					</div>
				</Form>
			</Formik>
		</>
	);
}
