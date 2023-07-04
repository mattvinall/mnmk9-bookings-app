"use client";
import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import router from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '../../../utils/trpc';
import Swal from 'sweetalert2';
import { GoogleReCaptcha, GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAuth } from '@clerk/nextjs';

const vetSchema = z.object({
    ownerId: z.string(),
    name: z.string(),
    address: z.string(),
    city: z.string(),
    phone: z.string().min(10).max(12),
    email: z.string().email(),
});

type FormData = z.infer<typeof vetSchema>;

const VetForm = () => {
    const [token, setToken] = useState<string | null>(null);
    const [key, setKey] = useState<string>("");
    const [score, setScore] = useState<number | null>(null);
    const [secret, setSecret] = useState<string>("");
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(vetSchema),
    });

    const { userId } = useAuth();

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


    const addVetDetails = trpc.vet.create.useMutation({
        onSuccess: () => {
            Swal.fire({
                title: "Success!",
                text: "Your Vet Details have been saved to your profile!",
                icon: "success",
                confirmButtonText: "Ok",
                confirmButtonColor: "#1D4ED8",
            }).then(() => {
                router.push(`/profile/${userId}`);
            });
        }
    });

    const verifyRecaptcha = trpc.recaptcha.verify.useMutation({
        onSuccess(data) {
            if (!data) return;
            setScore(data.score);
        },
        onError(error) {
            console.log("error verify recaptcha mutation", error);
        }
    });

    const onSubmit = (data: FormData) => {
        data.ownerId = userId as string;

        token && verifyRecaptcha.mutate({ token, secret });

        if (score && score <= 0.5) {
            Swal.fire({
                title: "Error!",
                text: "Please verify that you are human!",
                icon: "error",
                confirmButtonText: "Ok",
                confirmButtonColor: "#1D4ED8",
            });
        }

        addVetDetails.mutate(data);
    }

    return (
        <form style={{ position: "relative" }} className="w-[95%] md:w-[90%]" onSubmit={handleSubmit(onSubmit)}>
            <GoogleReCaptcha onVerify={handleReCaptchaVerify} action="VetInfoForm" />
            <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                    <input
                        {...register("name", { required: true })}
                        type="text"
                        name="name"
                        id="floating_name"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        required
                    />
                    <label
                        htmlFor="floating_postal_code"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Vet Name
                    </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <input
                        {...register("phone", { required: true })}
                        type="tel"
                        name="phoneNumber"
                        id="floating_phone_number"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        required
                    />
                    <label
                        htmlFor="floating_phone_number"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Phone Number
                    </label>
                </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                    <input
                        {...register("address", { required: true })}
                        type="text"
                        name="address"
                        id="floating_address"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        required
                    />
                    <label
                        htmlFor="floating_address"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Address
                    </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <input
                        {...register("city", { required: true })}
                        type="text"
                        name="city"
                        id="floating_city"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        required
                    />
                    <label
                        htmlFor="floating_city"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        City
                    </label>
                </div>
            </div>
            <button
                disabled={isSubmitting}
                type="submit"
                className="mt-[25px] rounded-full bg-gradient-to-l from-[#67A3A1] to-[#112B4E] hover:bg-gradient-to-r from-[#112B4E] to-[#67A3A1] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Submit
            </button>
        </form>
    )
}

export default VetForm