import { Formik } from "formik";
import * as Yup from "yup";

type Props = {
    deploySlice: (sliceData: any) => void,
}

const deploySliceValidationSchema = Yup.object({
    pyth: Yup.string().required("Required"),
    uniswapRouter: Yup.string().required("Required"),
    usdc: Yup.string().required("Required"),
})

export function DeploySliceForm({ deploySlice }: Props) {
    const handleDeploySliceSubmit = async (values: any) => {
        await deploySlice(values);
    }

    return (
        <>
            <article className="prose">
                <h2>Deploy Slice</h2>
            </article>
            <Formik
                initialValues={{
                    pyth: '0x',
                    uniswapRouter: '0x',
                    usdc: '0x',
                }}
                validationSchema={deploySliceValidationSchema}
                onSubmit={handleDeploySliceSubmit}
            >
            </Formik>
        </>
    );
}
