"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { AddPetFormSchema } from "../../../types/form-shema";
import { addPetFormSchema } from "../../../utils/schema";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useCallback, useEffect, useState } from "react";
import { GoogleReCaptcha, useGoogleReCaptcha } from "react-google-recaptcha-v3";

type Props = {
	setShowPetForm: (bool: boolean) => void;
	secret: string;
}

const AddPetForm = ({ setShowPetForm, secret }: Props): ReactJSXElement => {
	const [token, setToken] = useState<string>("");
	const [score, setScore] = useState<number | null>(null);

	const { data: sessionData } = useSession();
	const id = sessionData?.user?.id as string;
	const { data: userData, refetch } = trpc.user.byId.useQuery({ id });

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

	const addPet = trpc.pet.addPet.useMutation({
		onSuccess: () => refetch()
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

	const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<AddPetFormSchema>({
		resolver: zodResolver(addPetFormSchema)
	});

	const onSubmit: SubmitHandler<AddPetFormSchema> = async (formData: any) => {
		try {
			formData.ownerId = userData?.id;
			formData.vaccinated === "yes" ? formData.vaccinated = true : formData.vaccinated = false;

			verifyRecaptcha.mutate({ token, secret });

			if (score && score < 0.5) {
				console.log("score is less than 0.5");
				return;
			}

			addPet.mutate(formData);
			reset();

			// success message 
			Swal.fire({
				icon: 'success',
				title: `🐶`,
				text: `Successfully added a pet to your profile`,
			});

			setShowPetForm(false);

		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `Something went wrong! ${error}`,
			});
		}
	}

	const handleCloseForm = () => {
		setShowPetForm(false);
	};

	const rows = 2
	return (
		<form style={{ position: "relative" }} className="w-[90%] md:w-[90%] mt-6" onSubmit={handleSubmit(onSubmit)}>
			<GoogleReCaptcha onVerify={handleReCaptchaVerify} action="addPetForm" />
			<svg onClick={handleCloseForm} style={{ cursor: "pointer", position: "absolute", right: "0", top: "-20%", color: "white" }} className="w-6 h-6 mt-4" fill="#fff" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
					<textarea
						{...register("notes")}
						rows={rows}
						name="notes"
						id="notes"
						placeholder="Does your pet have any allergies? Special food? Aggressive behaviour? Let us know here"
						className="mt-3 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
					/>
					<label
						htmlFor="notes"
						className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y--4 peer-focus:scale-80 peer-focus:-translate-y-6">
						Notes
					</label>
				</div>

				<p className="mt-[-5px] text-white font-medium">Is your pet up to date with all of their vaccinations?</p>
				<div className="flex items-center mr-4 mb-4">
					<input
						{...register("vaccinated")}
						type="radio"
						name="vaccinated"
						value="yes"
						id="floating_vaccinated-yes"
						className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
					/>
					<label
						htmlFor="floating_vaccinated-yes"
						className="ml-2 mr-4 text-sm font-medium text-gray-900 dark:text-gray-300">
						Yes
					</label>
					<input
						{...register("vaccinated")}
						type="radio"
						name="vaccinated"
						value="no"
						id="floating_vaccinated-no"
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
				className="mt-[25px] rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
				Submit
			</button>
		</form>
	)
}

export default AddPetForm;