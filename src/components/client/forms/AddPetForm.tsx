"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from "../../../utils/trpc";
import Swal from "sweetalert2";
import { addPetFormSchema, AddPetFormType } from "../../../utils/schema";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useCallback, useEffect, useState } from "react";
import { GoogleReCaptcha, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
<<<<<<< HEAD
import { sexOptions, temperamentOptions, rows } from "../../../constants";

type Props = {
  secret: string;
}

const AddPetForm = ({ secret }: Props): ReactJSXElement => {
=======

type Props = {
  secret: string;
}

<<<<<<< HEAD
const AddPetForm = ({ setShowPetForm, secret }: Props): ReactJSXElement => {
>>>>>>> 097bf2e (add pet form update to include more fields to add to DB)
=======
const AddPetForm = ({ secret }: Props): ReactJSXElement => {
>>>>>>> f64f1e2 (removed setShowPetForm prop, no point to hide the form)
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

  const addPet = trpc.pet.addPet.useMutation({
    onSuccess: () => router.reload()
  });

  const onErrors = (errors: any) => console.error(errors);

  const verifyRecaptcha = trpc.recaptcha.verify.useMutation({
    onSuccess(data) {
      if (!data) return;
      setScore(data.score);
    },
    onError(error) {
      console.log("error verify recaptcha mutation", error);
    }
  });

<<<<<<< HEAD
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<AddPetFormType>({
    resolver: zodResolver(addPetFormSchema)
  });

  const onSubmit: SubmitHandler<AddPetFormType> = async (formData: any) => {
=======
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<AddPetFormSchema>({
    resolver: zodResolver(addPetFormSchema)
  });

  const onSubmit: SubmitHandler<AddPetFormSchema> = async (formData: any) => {
>>>>>>> 097bf2e (add pet form update to include more fields to add to DB)
    console.log("form data", formData);

    try {
      formData.ownerId = userId as string;
      formData.ovariohysterectomy === "yes" ? formData.ovariohysterectomy = true : formData.ovariohysterectomy = false;
      formData.age = parseInt(formData.age, 10);
      formData.weight = parseInt(formData.weight, 10);

      verifyRecaptcha.mutate({ token, secret });

      if (score && score < 0.5) {
        console.log("score is less than 0.5");
        return;
      }

      console.log("form data before mutation", formData);
      addPet.mutate(formData);

      reset();

      // success message 
      Swal.fire({
        icon: 'success',
        title: `Success!`,
        text: `Added a pet to your profile`,
      });

<<<<<<< HEAD
<<<<<<< HEAD
=======
      setShowPetForm(false);

>>>>>>> 097bf2e (add pet form update to include more fields to add to DB)
=======
>>>>>>> f64f1e2 (removed setShowPetForm prop, no point to hide the form)
    } catch (error) {
      console.log("error subitting form", error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Something went wrong! ${error}`,
      });
    }
  }

<<<<<<< HEAD
<<<<<<< HEAD
  return (
    <form style={{ position: "relative" }} className="w-[90%] md:w-[90%] mt-6" onSubmit={handleSubmit(onSubmit, onErrors)}>
      <GoogleReCaptcha onVerify={handleReCaptchaVerify} action="addPetForm" />
=======
  const handleCloseForm = () => {
    setShowPetForm(false);
  };

=======
>>>>>>> f64f1e2 (removed setShowPetForm prop, no point to hide the form)
  const sexOptions = ["MALE", "FEMALE"];

  const temperamentOptions = [
    "PASSIVE",
    "NEUTRAL",
    "AGGRESSIVE",
  ];

  const rows = 2;

  return (
    <form style={{ position: "relative" }} className="w-[90%] md:w-[90%] mt-6" onSubmit={handleSubmit(onSubmit, onErrors)}>
      <GoogleReCaptcha onVerify={handleReCaptchaVerify} action="addPetForm" />
<<<<<<< HEAD
      <svg onClick={handleCloseForm} style={{ cursor: "pointer", position: "absolute", right: "0", top: "-20%", color: "white" }} className="w-6 h-6 mt-4" fill="#fff" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
>>>>>>> 097bf2e (add pet form update to include more fields to add to DB)
=======
>>>>>>> f64f1e2 (removed setShowPetForm prop, no point to hide the form)
      <div className="grid md:grid-cols-1 md:gap-6">
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
            htmlFor="floating_name"
            className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Name
          </label>
        </div>
        <div className="relative z-0 mb-6 w-full group">
          <input
            {...register("breed", { required: true })}
            type="text"
            name="breed"
            id="floating_breed"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
            required
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
<<<<<<< HEAD
=======
          // onChange={handleChange}
>>>>>>> 097bf2e (add pet form update to include more fields to add to DB)
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
            required
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
            required
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
          // onChange={handleChangeTemperament}
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
            required
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

export default AddPetForm;