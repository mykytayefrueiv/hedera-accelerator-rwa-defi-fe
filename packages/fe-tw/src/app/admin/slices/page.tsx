"use client";

import { DeploySliceForm } from "@/components/Forms/DeploySliceForm";
import { useAdmin } from "@/hooks/useAdmin";

const AdminSlicesPage = () => {
    const { deploySlice } = useAdmin();

    return (
        <div className="flex p-20">
            <DeploySliceForm deploySlice={deploySlice} />
        </div>
    )
};

export default AdminSlicesPage;
