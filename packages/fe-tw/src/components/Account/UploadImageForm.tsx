import { uploadFileToPinata, uploadJsonToPinata } from "@/services/ipfsService";
import { prepareIPFSfileURL } from "@/utils/helpers";
import { pinata } from "@/utils/pinata";
import { useField } from "formik";
import { useState } from "react";
import { FileInput, Loading } from "react-daisyui";
import { toast } from "react-hot-toast";

export function UploadImageForm() {
	const [_, meta, helpers] = useField("buildingImageIpfsId");
	const [, fileMeta, fileHelpers] = useField("buildingImageIpfsFile");
	const [isUploading, setIsUploading] = useState(false);

	const uploadImageToIpfs = async (fileToUpload: File) => {
		setIsUploading(true);

		try {
			//@TODO switch to upload via server call
			// const keyImageRequest = await fetch("/api/pinataKey");
			// const keyImageData = await keyImageRequest.json();
			// const imageUploadResult = await pinata.upload
			// 	.file(fileToUpload)
			// 	.key(keyImageData.JWT);
			//
			// const ipfsURL = prepareIPFSfileURL(imageUploadResult.IpfsHash);

			//TEMPORARY upload via frontend call
			const ipfsHash = await uploadFileToPinata(
				fileToUpload,
				`image-${fileToUpload.name}`,
			);

			await helpers.setValue(ipfsHash);

			setIsUploading(false);
		} catch (e) {
			toast.error("Image file upload to IPFS failed");
			fileHelpers.setError("Image file upload to IPFS failed");
			setIsUploading(false);
		}
	};

	return (
		<>
			<label className="label" htmlFor="buildingImageIpfsFile">
				<span className="label-text">Or upload new image to IPFS</span>
			</label>

			<FileInput
				name="buildingImageIpfsFile"
				color="primary"
				className={"text-primary"}
				onChange={(event) => {
					if (event.currentTarget.files) {
						uploadImageToIpfs(event.currentTarget.files[0]);
					}
				}}
			/>
			<label className="label" htmlFor="buildingImageIpfsFile">
				{fileMeta.error && (
					<span className="label-text-alt text-red-700">{fileMeta.error}</span>
				)}
			</label>
			{isUploading && <Loading />}
		</>
	);
}
