import { watchContractEvent } from '@/services/contracts/watchContractEvent';
import { sliceFactoryAbi } from '@/services/contracts/abi/sliceFactoryAbi';
import { SLICE_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { useEffect, useState } from 'react';
import { QueryData, SliceData } from '@/types/erc3643/types';

// todo: Get rid of faked data, fetch real data from SC.
const sliceItemMock = (address: `0x${string}`) => ({
  imageUrl: "https://ca-times.brightspotcdn.com/dims4/default/ba0c5a1/2147483647/strip/true/crop/7872x5247+95+0/resize/2000x1333!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F63%2F4d%2F265a177543e6a76e7559aa0e5210%2F1243075903.jpg",
  name: "Stadiums",
  description: "Premier stadium developments supporting sports and large-scale events.",
  estimatedPrice: 70,
  timeToEnd: 1500000,
  allocation: 25,
  id: address,
  address,
});

export function useSlicesData() {
  const [slicesAddresses, setSlicesAddresses] = useState<`0x${string}`[]>([]);
  const [slices, setSlices] = useState<SliceData[]>([]);
  const [newSlicesLogs, setNewSlicesLogs] = useState<{ args: `0x${string}`[] }[]>([])

  /* watchContractEvent({
    address: SLICE_FACTORY_ADDRESS,
    abi: sliceFactoryAbi,
    eventName: "SliceDeployed",
    onLogs: (data) => {
      setNewSlicesLogs(prev => !prev.length ? data as unknown as { args: `0x${string}`[] }[] : prev);
    },
  }); */

  const requestSlicesMetadata = async () => {
    const slicesMetadata = await Promise.all(slicesAddresses.map(address => sliceItemMock(address)));

    setSlices(slicesMetadata);
  };

  useEffect(() => {
    setSlicesAddresses(newSlicesLogs.map(log => log.args[0]));
  }, [newSlicesLogs?.length]);

  useEffect(() => {
    if (slicesAddresses?.length) {
      requestSlicesMetadata();
    }
  }, [slicesAddresses]);

  return {
    slicesAddresses,
    slices,
  };
}
