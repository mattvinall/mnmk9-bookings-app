"use client";

import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { trpc } from '../../../utils/trpc';
import Swal from 'sweetalert2';
import { GoogleReCaptcha, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAuth } from '@clerk/nextjs';
import { VaccineFormType, vaccineFormSchema } from '../../../utils/schema';
import { getUserById } from '../../../api/users';
import { Pet } from '@prisma/client';

const VaccineForm = () => {
    const [token, setToken] = useState<string | null>(null);
    const [key, setKey] = useState<string>("");
    const [secret, setSecret] = useState<string>("");
    const [petName, setPetName] = useState<string | null>(null)
    const [petId, setPetID] = useState<string>("");

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VaccineFormType>({
        resolver: zodResolver(vaccineFormSchema),
    });

    const { userId } = useAuth();

    const { data: userDetail, refetch } = getUserById(userId as string);

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

    // on change grab the pet name, use the pet name to find the pet in the array and store the ID
    // set the ID of the pet selected to state
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // get the pet name from the target value
        const petName = e.target.value;

        // find the pet in the petData array based on the name to set the selected pet
        const petSelected = userDetail?.pets?.find((pet: Pet) => pet.name === petName);

        // store the ID of the pet
        const petSelectedId = petSelected?.id;

        // if petSelectedId is truthy, set the state
        petSelectedId && setPetID(petSelectedId);

        petName && setPetName(petName);
    }

    return (
        <div>VaccineForm</div>
    )
}

export default VaccineForm