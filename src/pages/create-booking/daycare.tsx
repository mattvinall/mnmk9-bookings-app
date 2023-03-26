"use client";

import { useState, useEffect, useCallback } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../../utils/trpc';
import Swal from "sweetalert2";
import { sendEmailDaycare } from "../../lib/email";
import DaycareForm from "../../components/client/forms/DaycareForm";
import { FormSchemaType } from "../../types/form-shema";
import { daycareSchema } from "../../utils/schema";
import {
	GoogleReCaptchaProvider,
} from 'react-google-recaptcha-v3';

const Daycare: NextPage = () => {
	const router = useRouter();

	const [token, setToken] = useState<string>("");
	const [key, setKey] = useState<string>("");
	const [secret, setSecret] = useState<string>("");

	useEffect(() => {
		const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;
		const secret = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET;

		if (key && key !== undefined) {
			setKey(key);
		}

		if (secret || secret !== undefined) {
			setSecret(secret);
		}
	}, []);

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

	// get email from session data
	const { data: sessionData } = useSession();
	const id = sessionData?.user?.id as string;

	// query user table by email to get user data
	const { data, isLoading, error } = trpc.user.byId.useQuery({ id })

	// query service table and find the service name of boarding and store the service ID
	const { data: serviceData } = trpc.service.getAllServices.useQuery();

	const training = serviceData?.find(service => service.serviceName === "Daycare");

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

	const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({
		resolver: zodResolver(daycareSchema)
	});

	const addNewDaycareBooking = trpc.bookings.newBooking.useMutation();

	const [petId, setPetID] = useState<string>("");

	useEffect(() => {
		if (petData && petData?.length > 1) {
			// store the pet ID of the first pet in the petData array as default
			const initialPetId = petData && petData[0]?.id;


			initialPetId && setPetID(initialPetId);
		}
	}, [petData])

	// on change grab the pet name, use the pet name to find the pet in the array and store the ID
	// set the ID of the pet selected to state
	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const petName = e.target.value;

		const petSelected = petData?.find(pet => pet.name === petName);
		const petSelectedId = petSelected?.id;

		petSelectedId && setPetID(petSelectedId);
	}

	const verifyRecaptcha = useCallback(async (token: string, secret: string) => {
		try {
			const url = process.env.NEXT_PUBLIC_RECAPTCHA_VERIFY_URL as string;
			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: `secret=${secret}&response=${token}`,
			});

			console.log("response from fetch", response);
		} catch (err) {
			console.log("error", err)
		}
	}, [token])

	const onSubmit: SubmitHandler<FormSchemaType> = async (formData: any) => {
		if (!token || token === "") return;

		const result = await verifyRecaptcha(token, secret);
		console.log("result from calling verify recaptcha", result)

		// TODO: logic to handle response and evaluate score

		try {
			if (trainingId) {
				formData.serviceId = trainingId;
			}

			if (data) {
				formData.userId = data?.id;
			}

			// if there is only 1 pet set the id, if there is multiple pet use the petId in state based on user selection
			const id = petData && petData[0]?.id;
			console.log("id if there is only 1 pet", id);
			formData.petId = petId ? petId : id;

			formData.serviceName = "Daycare";

			addNewDaycareBooking.mutate(formData);

			// reset form state
			reset();

			await sendEmailDaycare(
				[formData?.email, `${process.env.NEXT_PUBLIC_EMAIL_TO}`],
				`${process.env.NEXT_PUBLIC_EMAIL_TO}`,
				formData?.firstName,
				formData?.lastName,
				formData?.email,
				formData?.phoneNumber,
				formData?.petName,
				formData?.checkInDate,
				formData?.startTime,
				formData?.endTime,
				formData?.notes
			);

			// success message 
			Swal.fire({
				icon: 'success',
				title: `PAWesome 🐶`,
				text: `Successfully Booked ${formData.petName} for Daycare. An email confirmation with your booking details will be sent to your email.`,
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
					Book <span className="text-[hsl(280,100%,70%)]">Daycare</span>
				</h1>

				<p className="text-white text-center w-[80%] font-bold sm:text-[2.5rem]">
					Fill out the form below and someone from the MNMK-9 team will confirm your booking.
				</p>
				{key && key !== undefined ? (
					<GoogleReCaptchaProvider reCaptchaKey={key}>
						<DaycareForm petData={petData ?? []} setToken={setToken} setValue={setValue} isSubmitting={isSubmitting} register={register} handleSubmit={handleSubmit} onSubmit={onSubmit} handleChange={handleChange} />
					</GoogleReCaptchaProvider>
				) : null}
			</div >
		) : (
			<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
				<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Please Login to book a daycare appointment.</h1>
			</div>
		)
	)
}

export default Daycare;