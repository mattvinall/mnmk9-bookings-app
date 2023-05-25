"use client";

import { useState, useEffect, useCallback } from "react";
import { type NextPage } from "next";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../../utils/trpc';
import Swal from "sweetalert2";
import { sendEmailToAdmin } from "../../lib/email";
import GroomingForm from "../../components/client/forms/GroomingForm";
import { FormSchemaType } from "../../types/form-shema";
import { bookingFormSchema } from "../../utils/schema";
import {
	GoogleReCaptchaProvider,
} from 'react-google-recaptcha-v3';
import { Pet } from "../../types/router";

const Grooming: NextPage = () => {
	const router = useRouter();

	const [token, setToken] = useState<string>("");
	const [key, setKey] = useState<string>("");
	const [secret, setSecret] = useState<string>("");
	const [petId, setPetID] = useState<string>("");
	const [score, setScore] = useState<number | null>(null);

	// get email from session data
	const { data: sessionData } = useSession();
	const id = sessionData?.user?.id as string;

	// query user table by email to get user data
	const { data, isLoading, error } = trpc.user.byId.useQuery({ id })

	// query service table and find the service name of boarding and store the service ID
	const { data: serviceData } = trpc.service.getAllServices.useQuery();

	const training = serviceData?.find(service => service.serviceName === "Grooming");

	const trainingId = training?.id;

	// query the pets table and find the 
	const { data: petData } = trpc.pet.byOwnerId.useQuery({ id }, {
		onSettled(data, error) {
			if (!data || data.length === 0) {
				Swal.fire({
					icon: 'warning',
					title: 'Warning',
					text: 'Looks like you have not added a pet to your profile. You will now be routed to your profile page. Go to the tab "Add Pet" before trying to book a service!',
				}).then(response => {
					if (response.isConfirmed) {
						router.push(`/profile/${id}`);
					}
				});
			}
		},
	});

	const addNewGroomingBooking = trpc.bookings.newBooking.useMutation();

	const verifyRecaptcha = trpc.recaptcha.verify.useMutation({
		onSuccess(data) {
			if (!data) return;

			setScore(data.score);
		},
		onError(error) {
			console.log("error verify recaptcha mutation", error);
		}
	});

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

	useEffect(() => {
		if (petData && petData?.length > 1) {
			// store the pet ID of the first pet in the petData array as default
			const initialPetId = petData && petData[0]?.id;

			initialPetId && setPetID(initialPetId);
		}
	}, [petData])

	const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({
		resolver: zodResolver(bookingFormSchema)
	});

	// on change grab the pet name, use the pet name to find the pet in the array and store the ID
	// set the ID of the pet selected to state
	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const petName = e.target.value;

		const petSelected = petData?.find((pet: Pet) => pet.name === petName);

		const petSelectedId = petSelected?.id;

		petSelectedId && setPetID(petSelectedId);
	}

	const onSubmit: SubmitHandler<FormSchemaType> = async (formData) => {
		try {
			if (trainingId) {
				formData.serviceId = trainingId;
			}

			if (data) {
				formData.userId = data?.id;
			}

			// if there is only 1 pet set the id, if there is multiple pet use the petId in state based on user selection
			const id = petData && petData[0]?.id as string;

			if (id || petId) {
				formData.petId = petId ? petId as string : id as string;
			}

			formData.serviceName = "Grooming";

			verifyRecaptcha.mutate({ token, secret });

			if (score && score < 0.5) {
				console.log("score is less than 0.5");
				return;
			}

			addNewGroomingBooking.mutate(formData);

			// reset form
			reset();

			await sendEmailToAdmin(
				formData?.email,
				"matt.vinall7@gmail.com",
				formData?.firstName,
				formData?.lastName,
				formData?.email,
				formData?.phoneNumber,
				formData?.petName,
				formData?.checkInDate,
				formData?.startTime as string,
				formData?.endTime as string,
				"Daycare",
				formData?.notes as string
			);

			// success message 
			Swal.fire({
				icon: 'success',
				title: `PAWesome 🐶`,
				text: `Successfully Booked ${formData.petName} for Grooming. An email confirmation with your booking details will be sent to your email.`,
			}).then((result) => {
				if (result.isConfirmed) {
					// navigate to home page on submit
					router.push("/");
				}
			});

		} catch (error) {
			// error message
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `Something went wrong! ${error}`,
			});
		}
	}

	if (isLoading) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Loading....</h1>
		</div>
	);

	if (error) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Error....please contact support</h1>
		</div>
	)

	return (
		sessionData ? (
			<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
				<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-16">
					Book <span className="text-[rgb(103,163,161)]">Grooming</span>
				</h1>

				<p className="text-white text-center w-[80%] font-bold sm:text-[2.5rem]">
					Fill out the form below and someone from the MNMK-9 team will confirm your booking.
				</p>
				{key && key !== undefined ? (
					<GoogleReCaptchaProvider reCaptchaKey={key}>
						<GroomingForm petData={petData ?? []} setToken={setToken} setValue={setValue} isSubmitting={isSubmitting} register={register} handleSubmit={handleSubmit} onSubmit={onSubmit} handleChange={handleChange} />
					</GoogleReCaptchaProvider>
				) : null}
			</div >
		) : (
			<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
				<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Please Login to book a grooming appointment.</h1>
			</div>
		)
	)
}

export default Grooming;