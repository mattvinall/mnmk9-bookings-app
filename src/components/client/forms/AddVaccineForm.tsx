"use client";

import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { trpc } from '../../../utils/trpc';
import Swal from 'sweetalert2';
import { GoogleReCaptcha, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { VaccineFormType, vaccineFormSchema } from '../../../utils/schema';
import { vaccinationOptions } from '../../../constants';
import useUploadFileToS3 from '../../../hooks/useUploadFileToS3';

type Props = {
    petId: string;
    petName: string
    secret: string;
    refetch: () => void
}

const AddVaccineForm = ({ petId, petName, secret, refetch }: Props) => {
    const [token, setToken] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [newVaccineId, setNewVaccineId] = useState<string | null>(null);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VaccineFormType>({
        resolver: zodResolver(vaccineFormSchema),
    });

    const { mutate: verifyRecaptcha } = trpc.recaptcha.verify.useMutation();
    const { mutate: addVaccine } = trpc.vaccine.create.useMutation({
        onSuccess: (data) => {
            refetch();
            setNewVaccineId(data.id);
        }
    });

    const { mutate: updateVaccinationS3Url } = trpc.vaccine.updateS3Url.useMutation({
        onSuccess: () => refetch()
    });

    const {
        uploadedS3Url,
        handleDocumentFileChange,
        fileName,
    } = useUploadFileToS3(petName as string, 'vaccinations');

    console.log("uploaded s3 url after calling useUploadToS3 hook", uploadedS3Url)

    const { executeRecaptcha } = useGoogleReCaptcha();

    // Create an event handler so you can call the verification on button click event or form submit
    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        const token = await executeRecaptcha('VetInfoForm');
        setToken(token)
        console.log("token", token);
        // Do whatever you want with the token
    }, [executeRecaptcha]);

    // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
        handleReCaptchaVerify();
    }, [handleReCaptchaVerify]);

    useEffect(() => {
        newVaccineId !== null && uploadedS3Url && submitted &&
            updateVaccinationS3Url({
                id: newVaccineId,
                uploadedS3Url
            });
        () => {
            setSubmitted(false);
            setNewVaccineId(null);
        }
    }, [uploadedS3Url, submitted]);

    const onSubmit = async (formData: VaccineFormType) => {
        console.log("form data", formData);
        try {
            token && secret && verifyRecaptcha({ secret, token });
            console.log("uplaoed s3 url", uploadedS3Url);

            fileName && petId && uploadedS3Url && addVaccine({
                ...formData,
                fileName,
                petId,
                validTo: new Date(formData.validTo),
                uploadedS3Url
            });

            Swal.fire({
                icon: 'success',
                title: 'Upload Successful',
                text: 'Vaccine uploaded to your pets profile!',
            });

            reset();
            setSubmitted(true);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Error',
                text: 'Could not upload vaccine to your pets profile!',
            })
        }
    }


    return (
        <form style={{ position: "relative" }} className="w-full md:w-1/2 mt-6" onSubmit={handleSubmit(onSubmit)}>
            <GoogleReCaptcha onVerify={handleReCaptchaVerify} action="addPetForm" />
            <div className="grid md:grid-cols-1 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                    <label
                        htmlFor="vaccine-select"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Vaccine Name
                    </label>
                    <select
                        {...register("name")}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        id="vaccine-select"

                    >
                        {vaccinationOptions?.map((name, index) => (
                            <option key={index} className="text-gray-900 w-[10%]" value={name}>{name}</option>
                        ))}
                    </select>
                    <svg
                        style={{ fill: "#fff", position: "absolute", right: "0", bottom: "15px", height: "20px" }}
                        className="ml-2 w-4 h-4"
                        aria-hidden="true"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2" d="M19 9l-7 7-7-7">
                        </path>
                    </svg>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <label htmlFor="file" className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Vaccination File</label>
                    <input
                        type="file"
                        id="file"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        placeholder="click to select file"
                        onChange={handleDocumentFileChange}
                    />
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <label htmlFor="validToDate" className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Valid To:</label>
                    <input
                        {...register("validTo", { required: true })}
                        type="date"
                        id="validToDate"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        placeholder="click to select file"
                        required
                    />
                </div>
            </div>
            <button
                disabled={isSubmitting}
                type="submit"
                className="mt-[25px] rounded-full bg-gradient-to-l bg-gradient-to-l from-[#A70D0E] to-[#EEB62B] hover:bg-gradient-to-r from-[#EEB62B] to-[#A70D0E] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Submit
            </button>
        </form>
    )
}

export default AddVaccineForm;