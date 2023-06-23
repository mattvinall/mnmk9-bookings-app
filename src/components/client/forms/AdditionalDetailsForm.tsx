"use client";

import { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from "../../../utils/trpc";
import Swal from "sweetalert2";
import { GoogleReCaptcha, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";

type Props = {
    setShowAdditionalDetailsForm: Dispatch<SetStateAction<boolean>>
    secret: string;
}

const AdditionalDetailsForm = ({ setShowAdditionalDetailsForm, secret }: Props) => {
    const [token, setToken] = useState<string>("");
    const [score, setScore] = useState<number | null>(null);

    const { userId } = useAuth();

    const { executeRecaptcha } = useGoogleReCaptcha()
    // Create an event handler so you can call the verification on button click event or form submit
    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        const token = await executeRecaptcha('addPetForm');
        setToken(token)
        console.log("token", token);
        // Do whatever you want with the token
    }, [executeRecaptcha]);

    // You can use useEffect to trigger the verification as soon as the component being loaded
    useEffect(() => {
        handleReCaptchaVerify();
    }, [handleReCaptchaVerify]);

    const router = useRouter();
    return (
        <></>
    )
}

export default AdditionalDetailsForm