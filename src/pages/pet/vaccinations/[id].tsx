import { NextPage } from 'next';
import { useRouter } from "next/router";
import { trpc } from '../../../utils/trpc';
import { useEffect, useState } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import EditVaccineForm from '../../../components/client/forms/EditVaccineForm';

const Vaccinations: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string;

    const [secret, setSecret] = useState<string>("");
    const [key, setKey] = useState<string>("");

    const { data: vaccineDetail, refetch } = trpc.vaccine.byId.useQuery({ id })

    console.log("vaccine detail in pet/vaccinations/id page", vaccineDetail);

    const { data: petDetail } = trpc.pet.getNameById.useQuery({ id: vaccineDetail?.petId as string })
    const petName = petDetail && petDetail?.length > 0 && petDetail?.map((pet) => pet.name)[0] as string || "";
    console.log("pet name", petName);

    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;
        const secret = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET;

        if (!key) return;
        if (!secret) return;

        setKey(key);
        setSecret(secret);
    }, [key, secret]);

    const handleGoBack = () => {
        router.back();
    }

    return (
        <section className="container flex flex-col gap-12 px-16 py-16 max-w-8xl">
            <a onClick={handleGoBack} className="flex justify-start text-left text-white font-bold text-2xl cursor-pointer">Go Back</a>
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-16">
                Edit <span className="text-[rgb(238,182,43)]">Vaccinations</span>
            </h1>
            <div className="flex justify-between items-baseline">
                {/* vaccine detail card */}
                <div key={vaccineDetail?.id} className='my-6'>
                    <div className="flex flex-col rounded-lg shadow-lg bg-white max-w-full w-[90%] md:w-[24rem]">
                        <div className="p-6 mt-6">
                            <div className="flex justify-betweem items-center border-slate-600 border-b-2 pb-2">
                                <h2 className="text-gray-900 text-3xl font-medium mb-2 w-3/4">{vaccineDetail?.name}</h2>
                            </div>
                            <div className="my-4 border-slate-500 border-b-2">
                                <div className="mb-4">
                                    <p className="text-gray-600 font-medium text-lg">Valid To - {vaccineDetail?.validTo.toLocaleDateString("en")}</p>
                                </div>
                            </div>
                            <div className="my-4 flex flex-col">
                                {/* add s3 url link to download */}
                                <div className="mb-4 border-slate-500 border-b-2 pb-4">
                                    <p className="text-gray-600 font-medium text-lg">File name - {vaccineDetail?.fileName}</p>
                                </div>
                                {vaccineDetail?.uploadedS3Url ? (
                                    <div className="my-4">
                                        <button className="rounded-full bg-gradient-to-b from-[#A70D0E] to-[#EEB62B] hover:bg-gradient-to-t from-[#EEB62B] to-[#A70D0E] px-10 py-3 font-semibold text-white hover:underline transition">
                                            <a href={vaccineDetail?.uploadedS3Url} target="_blank" rel="noreferrer">View File</a>
                                        </button>
                                    </div>
                                ) : <p className="text-gray-600 font-medium text-lg">No file uploaded</p>}
                            </div>
                        </div>
                    </div>
                </div>
                {/* form */}
                {vaccineDetail && secret && key && petDetail && petName && (
                    <GoogleReCaptchaProvider reCaptchaKey={key}>
                        <EditVaccineForm vaccineDetail={vaccineDetail} secret={secret} refetch={refetch} name={petName} />
                    </GoogleReCaptchaProvider>
                )}
            </div>
        </section>
    )
}

export default Vaccinations; 