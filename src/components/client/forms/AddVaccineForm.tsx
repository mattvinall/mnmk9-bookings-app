"use client";

import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { trpc } from '../../../utils/trpc';
import Swal from 'sweetalert2';
import { GoogleReCaptcha, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { VaccineFormType, vaccineFormSchema } from '../../../utils/schema';

type Props = {
    petId: string;
}

const AddVaccineForm = ({ petId }: Props) => {
    const [token, setToken] = useState<string | null>(null);
    const [key, setKey] = useState<string>("");
    const [secret, setSecret] = useState<string>("");

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VaccineFormType>({
        resolver: zodResolver(vaccineFormSchema),
    });

    const { mutate: addVaccine, isLoading } = trpc.vaccine.create.useMutation();

    const { executeRecaptcha } = useGoogleReCaptcha()
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

    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;
        const secret = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET;

        if (key && key !== undefined) {
            setKey(key);
        }

        if (secret || secret !== undefined) {
            setSecret(secret);
        }
    }, [key, secret]);

    // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
        handleReCaptchaVerify();
    }, [handleReCaptchaVerify]);

    // useEffect(() => {
    // 	if (uploadedVaccinationDocumentUrl && petId) {
    // 		uploadVaccinationDocument.mutate({
    // 			petId,
    // 			fileName: uploadedVaccinationDocumentUrl.split(".")[0] as string,
    // 			uploadedS3Url: uploadedVaccinationDocumentUrl,
    // 			validTo: new Date("2024-01-01"),
    // 			name: "Lepto Vaccine"
    // 		});
    // 	}
    // }, [uploadedVaccinationDocumentUrl]);

    const onSubmit = async (formData: VaccineFormType) => {
        try {
            addVaccine({
                petId,
                ...formData,
            });
            Swal.fire({
                icon: 'success',
                title: 'Upload Successful',
                text: 'Vaccine uploaded to your pets profile!',
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Error',
                text: 'Could not upload vaccine to your pets profile!',
            })
        }
    }


    return (
        <div>VaccineForm</div>
    )
}

export default AddVaccineForm;