"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import { buildingAbi } from "@/services/contracts/abi/buildingAbi";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";

export function useBuildingLiquidity() {
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function addLiquidity({
    buildingAddress,
    tokenAAddress,
    tokenBAddress,
    tokenAAmount,
    tokenBAmount,
  }: {
    buildingAddress: string;
    tokenAAddress: string;
    tokenBAddress: string;
    tokenAAmount: string;
    tokenBAmount: string;
  }) {
    try {
      setIsAddingLiquidity(true);
      setTxHash(null);

      if (!window.ethereum) {
        toast.error("No crypto wallet found. Please install one (e.g. MetaMask).");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const parsedTokenA = ethers.parseUnits(tokenAAmount, 18);
      const parsedTokenB = ethers.parseUnits(tokenBAmount, 6);

      const tokenAContract = new ethers.Contract(tokenAAddress as `0x${string}`, tokenAbi, signer);
      const txA = await tokenAContract.approve(buildingAddress, parsedTokenA);
      await txA.wait();

      const tokenBContract = new ethers.Contract(tokenBAddress as `0x${string}`, tokenAbi, signer);
      const txB = await tokenBContract.approve(buildingAddress, parsedTokenB);
      await txB.wait();

      const buildingContract = new ethers.Contract(buildingAddress as `0x${string}`, buildingAbi, signer);
      const txLiquify = await buildingContract.addLiquidity(
        tokenAAddress,
        parsedTokenA,
        tokenBAddress,
        parsedTokenB,
        {
          value: ethers.parseEther("20"),
          gasLimit: 800000,
        }
      );
      const receipt = await txLiquify.wait();

      setTxHash(receipt.transactionHash);
      toast.success("Liquidity added successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(`Failed to add liquidity: ${error.message}`);
    } finally {
      setIsAddingLiquidity(false);
    }
  }

  return {
    isAddingLiquidity,
    txHash,
    addLiquidity,
  };
}
