import { uploadFileToPinata } from "@/services/ipfsService";
import { useField } from "formik";
import { useState } from "react";
import { FileInput, Loading } from "react-daisyui";
import { toast } from "react-hot-toast";

type Props = {
	fileHashName?: string,
}

export function UploadImageForm({ fileHashName = 'buildingImageIpfsFile' }: Props) {
	const [_, meta, helpers] = useField(fileHashName);
	const [, fileMeta, fileHelpers] = useField(fileHashName);
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
			<label className="label" htmlFor={fileHashName}>
				<span className="label-text">Or upload new image to IPFS</span>
			</label>

			<FileInput
				name={fileHashName}
				color="primary"
				className={"text-primary"}
				onChange={(event) => {
					if (event.currentTarget.files) {
						uploadImageToIpfs(event.currentTarget.files[0]);
					}
				}}
			/>
			<label className="label" htmlFor={fileHashName}>
				{fileMeta.error && (
					<span className="label-text-alt text-red-700">{fileMeta.error}</span>
				)}
			</label>
			{isUploading && <Loading />}
		</>
	);
}
