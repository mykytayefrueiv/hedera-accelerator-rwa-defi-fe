import { useSliceDetails } from "@/hooks/useSliceDetails";
import React, { useEffect } from "react";

type Props = {
    address: `0x${string}`;
    setSlicesDetails: any;
};

export const SliceDetailsView = ({ address, setSlicesDetails }: Props) => {
    const { sliceDetails } = useSliceDetails(address);

    useEffect(() => {
        if (!!sliceDetails) {
            setSlicesDetails((prev: any) => [...prev, ...sliceDetails])
        }
    }, [sliceDetails]);

    return <></>;
}
