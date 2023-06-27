"use client";

import { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import type { Pet, User } from '@prisma/client';
<<<<<<< HEAD
import VaccineForm from './VaccineForm';
import VetForm from './VetForm';


interface UserDetail extends User {
    pets: Pet[]
}

type Props = {
    setShowAdditionalDetailsForm: Dispatch<SetStateAction<boolean>>,
    secret: string;
    userDetail: UserDetail
}

const AdditionalDetailsForm = ({ userDetail, setShowAdditionalDetailsForm, secret }: Props) => {
    const [token, setToken] = useState<string>("");
    const [score, setScore] = useState<number | null>(null);
    const [isUpdatingVetInfo, setIsUpdatingVetInfo] = useState(true);
=======
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from "../../../utils/trpc";
import Swal from "sweetalert2";
=======
>>>>>>> d41ba88 (removed all react hook form and other imports, moving to separate components)
import { GoogleReCaptcha, useGoogleReCaptcha } from "react-google-recaptcha-v3";
=======
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
>>>>>>> 85e00e8 (remove import)
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Pet, User } from '@prisma/client';
=======
>>>>>>> 3978c14 (added type keyword)
import VaccineForm from './VaccineForm';
import VetForm from './VetForm';


interface UserDetail extends User {
    pets: Pet[]
}

type Props = {
    setShowAdditionalDetailsForm: Dispatch<SetStateAction<boolean>>,
    secret: string;
    userDetail: UserDetail
}

const AdditionalDetailsForm = ({ userDetail, setShowAdditionalDetailsForm, secret }: Props) => {
    const [token, setToken] = useState<string>("");
    const [score, setScore] = useState<number | null>(null);
<<<<<<< HEAD
>>>>>>> 90b4fe3 (base setup for additional details form - add vet info, vaccination records, etc)
=======
    const [isUpdatingVetInfo, setIsUpdatingVetInfo] = useState(true);
>>>>>>> d41ba88 (removed all react hook form and other imports, moving to separate components)

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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d41ba88 (removed all react hook form and other imports, moving to separate components)

    const handleToggle = () => {
        setIsUpdatingVetInfo(!isUpdatingVetInfo);
    };

<<<<<<< HEAD
    return (
        <div>
            <button className="rounded-full text-xs font-bold text-white bg-red-500 py-1 px-2" onClick={handleToggle}>
                {isUpdatingVetInfo ? 'Add Vaccination Documents' : 'Update Vet Information'}
            </button>
            {isUpdatingVetInfo ? (
                <VetForm userDetail={userDetail} />
                // <form onSubmit={handleSubmit(onSubmit)}>
                //     <label>
                //         Pet:
                //         <select
                //             value={selectedPet}
                //             {...register('petName')}
                //         >
                //             {userDetail?.pets?.map((pet) => (
                //                 <option key={pet} value={pet}>
                //                     {pet}
                //                 </option>
                //             ))}
                //         </select>
                //     </label>
                //     <label>
                //         Vet Name:
                //         <input
                //             type="text"
                //             name="name"
                //             {...register('name')}
                //         />
                //         {errors.vetName && <span>{errors.name.message}</span>}
                //     </label>
                //     <label>
                //         Vet Phone Number:
                //         <input
                //             type="text"
                //             name="vetPhoneNumber"
                //             {...register('vetPhoneNumber')}
                //         />
                //         {errors.vetPhoneNumber && <span>{errors.vetPhoneNumber.message}</span>}
                //     </label>
                //     <label>
                //         Vet Email:
                //         <input
                //             type="text"
                //             name="vetEmail"
                //             {...register('vetEmail')}
                //         />
                //         {errors.vetEmail && <span>{errors.vetEmail.message}</span>}
                //     </label>
                //     <label>
                //         Vet Address:
                //         <input
                //             type="text"
                //             name="vetAddress"
                //             {...register('vetAddress')}
                //         />
                //         {errors.vetAddress && <span>{errors.vetAddress.message}</span>}
                //     </label>
                //     <button type="submit">
                //         Submit
                //     </button>
                // </form>
            ) : (
                <VaccineForm userDetail={userDetail} />
                // <form onSubmit={handleSubmit(onSubmit)}>
                //     <label>
                //         Vaccine Name:
                //         <input
                //             type="text"
                //             name="vaccineName"
                //             {...register('vaccineName')}
                //         />
                //         {errors.vaccineName && <span>{errors.vaccineName.message}</span>}
                //     </label>
                //     <label>
                //         Valid Until:
                //         <input
                //             type="text"
                //             name="vaccineValidUntil"
                //             {...register('vaccineValidUntil')}
                //         />
                //         {errors.vaccineValidUntil && <span>{errors.vaccineValidUntil.message}</span>}
                //     </label>
                //     <button type="submit">
                //         Submit
                //     </button>
                // </form>
            )}
        </div>
    );
}

export default AdditionalDetailsForm;
=======
=======
>>>>>>> d41ba88 (removed all react hook form and other imports, moving to separate components)
    return (
        <div>
            <button className="rounded-full text-xs font-bold text-white bg-red-500 py-1 px-2" onClick={handleToggle}>
                {isUpdatingVetInfo ? 'Add Vaccination Documents' : 'Update Vet Information'}
            </button>
            {isUpdatingVetInfo ? (
                <VetForm userDetail={userDetail} />
                // <form onSubmit={handleSubmit(onSubmit)}>
                //     <label>
                //         Pet:
                //         <select
                //             value={selectedPet}
                //             {...register('petName')}
                //         >
                //             {userDetail?.pets?.map((pet) => (
                //                 <option key={pet} value={pet}>
                //                     {pet}
                //                 </option>
                //             ))}
                //         </select>
                //     </label>
                //     <label>
                //         Vet Name:
                //         <input
                //             type="text"
                //             name="name"
                //             {...register('name')}
                //         />
                //         {errors.vetName && <span>{errors.name.message}</span>}
                //     </label>
                //     <label>
                //         Vet Phone Number:
                //         <input
                //             type="text"
                //             name="vetPhoneNumber"
                //             {...register('vetPhoneNumber')}
                //         />
                //         {errors.vetPhoneNumber && <span>{errors.vetPhoneNumber.message}</span>}
                //     </label>
                //     <label>
                //         Vet Email:
                //         <input
                //             type="text"
                //             name="vetEmail"
                //             {...register('vetEmail')}
                //         />
                //         {errors.vetEmail && <span>{errors.vetEmail.message}</span>}
                //     </label>
                //     <label>
                //         Vet Address:
                //         <input
                //             type="text"
                //             name="vetAddress"
                //             {...register('vetAddress')}
                //         />
                //         {errors.vetAddress && <span>{errors.vetAddress.message}</span>}
                //     </label>
                //     <button type="submit">
                //         Submit
                //     </button>
                // </form>
            ) : (
                <VaccineForm userDetail={userDetail} />
                // <form onSubmit={handleSubmit(onSubmit)}>
                //     <label>
                //         Vaccine Name:
                //         <input
                //             type="text"
                //             name="vaccineName"
                //             {...register('vaccineName')}
                //         />
                //         {errors.vaccineName && <span>{errors.vaccineName.message}</span>}
                //     </label>
                //     <label>
                //         Valid Until:
                //         <input
                //             type="text"
                //             name="vaccineValidUntil"
                //             {...register('vaccineValidUntil')}
                //         />
                //         {errors.vaccineValidUntil && <span>{errors.vaccineValidUntil.message}</span>}
                //     </label>
                //     <button type="submit">
                //         Submit
                //     </button>
                // </form>
            )}
        </div>
    );
}

<<<<<<< HEAD
export default AdditionalDetailsForm
>>>>>>> 90b4fe3 (base setup for additional details form - add vet info, vaccination records, etc)
=======
export default AdditionalDetailsForm;
>>>>>>> d41ba88 (removed all react hook form and other imports, moving to separate components)
