export const prepareIPFSfileURL = (ipfsHash: string) =>
	`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`;
