"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from "../../../utils/trpc";
import Swal from "sweetalert2";
import { editPetFormSchema, EditPetFormType } from "../../../utils/schema";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useCallback, useEffect, useState } from "react";
import { GoogleReCaptcha, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRouter } from "next/router";
import { sexOptions, temperamentOptions, rows } from "../../../constants";
import { Pet } from "@prisma/client";

type Props = {
    secret: string
    petId: string,
    petDetails: Pet[]
}

const EditPetForm = ({ secret, petId, petDetails }: Props): ReactJSXElement => {
    const petDetail = petDetails[0];

    const [token, setToken] = useState<string>("");

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

    const editPet = trpc.pet.editPet.useMutation({
        onSuccess: () => router.reload()
    });

    const onErrors = (errors: any) => console.error(errors);

    const verifyRecaptcha = trpc.recaptcha.verify.useMutation();

    const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm<EditPetFormType>({
        resolver: zodResolver(editPetFormSchema)
    });

    // iterate over petDetail and set values using setValue from react-hook-form
    useEffect(() => {
        if (!petDetail) return;

        const {
            name,
            breed,
            age,
            sex,
            weight,
            temperament,
            ovariohysterectomy,
            microchipNumber,
            medicalNotes,
            feedingNotes,
        } = petDetail;
        setValue("name", name);
        setValue("breed", breed);
        age && setValue("age", age.toString());
        setValue("sex", sex);
        weight && setValue("weight", weight.toString());
        setValue("temperament", temperament);
        setValue("ovariohysterectomy", ovariohysterectomy ? "yes" : "no");
        setValue("microchipNumber", microchipNumber ? microchipNumber : "");
        setValue("feedingNotes", feedingNotes ? feedingNotes : "");
        setValue("medicalNotes", medicalNotes ? medicalNotes : "");
    }, [])
    const onSubmit: SubmitHandler<EditPetFormType> = async (formData: EditPetFormType) => {
        console.log("form data", formData);
        try {
            const {
                name,
                breed,
                sex,
                age,
                weight,
                ovariohysterectomy,
                temperament,
                microchipNumber,
                medicalNotes,
                feedingNotes,
            } = formData;

            verifyRecaptcha.mutate({ token, secret });

            if (!age || !weight) return;

            const formattedWeight = weight && parseInt(weight, 10);
            const formattedAge = age && parseInt(age, 10);
            const formattedOvariohysterectomy = ovariohysterectomy && ovariohysterectomy === "yes" ? true : false;


            petDetail && editPet.mutate({
                id: petId,
                name: name ? name : petDetail.name,
                breed: breed ? breed : petDetail.breed,
                sex: sex ? sex : petDetail.sex,
                age: formattedAge ? formattedAge : petDetail.age || 0,
                weight: formattedWeight ? formattedWeight : petDetail.weight || 0,
                ovariohysterectomy: ovariohysterectomy ? formattedOvariohysterectomy : petDetail.ovariohysterectomy,
                temperament: temperament ? temperament : petDetail.temperament,
                microchipNumber,
                medicalNotes,
                feedingNotes,
            });

            reset();

            // success message 
            Swal.fire({
                icon: 'success',
                title: `Success!`,
                text: `Added a pet to your profile`,
            });

        } catch (error) {
            console.log("error subitting form", error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Something went wrong! ${error}`,
            });
        }
    }

    return (
        <form style={{ position: "relative" }} className="w-full xl:w-1/2 my-6 py-12 xl:my-0 xl:py-0" onSubmit={handleSubmit(onSubmit, onErrors)}>
            <GoogleReCaptcha onVerify={handleReCaptchaVerify} action="addPetForm" />
            <div className="grid md:grid-cols-1 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                    <input
                        {...register("name")}
                        type="text"
                        name="name"
                        id="floating_name"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                    />
                    <label
                        htmlFor="floating_name"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Name
                    </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <input
                        {...register("breed")}
                        type="text"
                        name="breed"
                        id="floating_breed"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                    />
                    <label
                        htmlFor="floating_breed"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Breed
                    </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <label
                        htmlFor="pet-select"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Sex
                    </label>
                    <select
                        {...register("sex")}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        id="pet-select"
                    >
                        {sexOptions?.map((sex, index) => (
                            <option key={index} className="text-gray-900 w-[10%]" value={sex}>{sex.toLowerCase()}</option>
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
                    <input
                        {...register("age")}
                        type="text"
                        name="age"
                        id="floating_age"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                    />
                    <label
                        htmlFor="floating_age"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Age (years)
                    </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <input
                        {...register("weight")}
                        type="text"
                        name="weight"
                        id="floating_weight"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                    />
                    <label
                        htmlFor="floating_weight"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Weight (lbs)
                    </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <label
                        htmlFor="pet-select"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Temperament
                    </label>
                    <select
                        {...register("temperament")}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        id="temperament"
                    >
                        {temperamentOptions?.map((temperament, index) => (
                            <option key={index} className="text-gray-900 w-[10%]" defaultValue={temperament} value={temperament}>{temperament.toLowerCase()}</option>
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
                    <input
                        {...register("microchipNumber")}
                        type="text"
                        name="microchipNumber"
                        id="floating_microchipNumber"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                    />
                    <label
                        htmlFor="floating_microchipNumber"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Microchip #
                    </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <textarea
                        {...register("feedingNotes")}
                        rows={rows}
                        name="feedingNotes"
                        id="feedingNotes"
                        placeholder="what time of day do you feed your pet? What do you feed them? How much?"
                        className="mt-3 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                    />
                    <label
                        htmlFor="feedingNotes"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y--4 peer-focus:scale-80 peer-focus:-translate-y-6">
                        Feeding Notes/Instructions
                    </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                    <textarea
                        {...register("medicalNotes")}
                        rows={rows}
                        name="medicalNotes"
                        id="medicalNotes"
                        placeholder="what time of day does your pet need medication? How many times a day? How much?"
                        className="mt-3 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                    />
                    <label
                        htmlFor="medialNotes"
                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y--4 peer-focus:scale-80 peer-focus:-translate-y-6">
                        Medical Notes/Instructions
                    </label>
                </div>
                <p className="mt-[-5px] text-white font-medium">Is your Pet Spayed/Neutered?</p>
                <div className="flex items-center mr-4 mb-4">
                    <input
                        {...register("ovariohysterectomy")}
                        type="radio"
                        name="ovariohysterectomy"
                        value="yes"
                        id="floating_ovariohysterectomy-yes"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                        htmlFor="floating_ovariohysterectomy-yes"
                        className="ml-2 mr-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Yes
                    </label>
                    <input
                        {...register("ovariohysterectomy")}
                        type="radio"
                        name="ovariohysterectomy"
                        value="no"
                        id="floating_ovariohysterectomy-no"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                        htmlFor="floating_vaccinated-no"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        No
                    </label>
                </div>
            </div>
            <button
                disabled={isSubmitting}
                type="submit"
                className="mt-[25px] rounded-full bg-gradient-to-l from-[#67A3A1] to-[#112B4E] hover:bg-gradient-to-r from-[#112B4E] to-[#67A3A1] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Submit
            </button>
        </form >
    )
}

export default EditPetForm;