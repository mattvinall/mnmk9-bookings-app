// 'use client';

import { useState, useEffect, useCallback } from "react";
import { type NextPage } from "next";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../../utils/trpc';
import { sendEmailBoarding } from "../../lib/email";
import Swal from "sweetalert2";
import BoardingForm from "../../components/client/forms/BoardingForm";
import { FormSchemaType } from "../../types/form-schema";
import { boardingSchema } from "../../utils/schema";
import {
	GoogleReCaptchaProvider,
} from 'react-google-recaptcha-v3';
// import verifyRecaptcha from "../../utils/verifyRecaptcha";


const Boarding: NextPage = () => {
	const { data: sessionData } = useSession();
	const id = sessionData?.user?.id as string;
	const router = useRouter();

	const [petId, setPetID] = useState<string>("");
	const [token, setToken] = useState<string>("");
	const [key, setKey] = useState<string>("")

	useEffect(() => {
		const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;

		if (key && key !== undefined) {
			setKey(key);

			console.log("key in state", key)
		}
	}, []);

	// query user table by email to get user data
	const { data, isLoading, error } = trpc.user.byId.useQuery({ id })

	// query service table and find the service name of boarding and store the service ID
	const { data: serviceData } = trpc.service.getAllServices.useQuery();

	const boarding = serviceData?.find(service => service.serviceName === "Boarding");
	const boardingId = boarding?.id as string;

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

	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({
		resolver: zodResolver(boardingSchema)
	});

	const addNewBooking = trpc.bookings.newBooking.useMutation();

	useEffect(() => {
		if (petData && petData?.length > 1) {
			// store the pet ID of the first pet in the petData array as default
			const initialPetId = petData && petData[0]?.id;


			initialPetId && setPetID(initialPetId);
		}
	}, [petData])

	// on change grab the pet name, use the pet name to find the pet in the array and store the ID
	// set the ID of the pet selected to state
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// get the pet name from the target value
		const petName = e.target.value;

		// find the pet in the petData array based on the name to set the selected pet
		const petSelected = petData?.find(pet => pet.name === petName);

		// store the ID of the pet
		const petSelectedId = petSelected?.id;

		// if petSelectedId is truthy, set the state
		petSelectedId && setPetID(petSelectedId);
	}

	const verifyRecaptcha = async (token: string, secret: string) => {
		const url = 'https://www.google.com/recaptcha/api/siteverify';
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Access-Control-Allow-Origin": "*"
				},
				body: `secret=${secret}&response=${token}`,
			});

			const json = await response.json();
			console.log("json", json)

			// setToken("")

		} catch (err) {
			console.log("error", err)
			// setToken("")
		}
	}

	const onSubmit: SubmitHandler<FormSchemaType> = async (formData: any) => {
		if (!token || token === "") return;

		console.log("token in on submit", token)

		const result = await verifyRecaptcha(token, "6LfgumMkAAAAAHqV2tiifsX4V6W82UZYNkmBr8MQ");
		console.log("result from calling verify recaptcha", result)

		// TODO: logic to handle response and evaluate score

		try {
			// check if boardingId is truthy and then set the id of the service
			if (boardingId) {
				formData.serviceId = boardingId;
			}

			// if data (user session) is truthy, set the userId
			if (data) {
				formData.userId = data?.id;
			}

			// if there is only 1 pet set the id, if there is multiple pet use the petId in state based on user selection
			const id = petData && petData[0]?.id;
			formData.petId = petId ? petId : id;

			// set the service name to Boarding
			formData.serviceName = "Boarding";

			// mutate / POST request to bookings api endpoint and submit the form data
			// addNewBooking.mutate(formData);

			// reset the form state
			reset();

			// call send email function that leverages AWS SES to send the form data via email
			// await sendEmailBoarding(
			// 	formData?.email,
			// 	// process.env.NEXT_PUBLIC_EMAIL_TO as string,
			// 	"matt.vinall7@gmail.com",
			// 	formData?.firstName,
			// 	formData?.lastName,
			// 	formData?.email,
			// 	formData?.phoneNumber,
			// 	formData?.petName,
			// 	formData?.checkInDate,
			// 	formData?.checkOutDate,
			// 	formData?.notes
			// );

			// success message 
			Swal.fire({
				icon: 'success',
				title: `PAWesome 🐶`,
				text: `Successfully Booked ${formData.petName} for Boarding.An email confirmation with your booking details will be sent to your email.`,
			}).then((result) => {
				if (result.isConfirmed) {
					// navigate to home page on submit
					router.push("/");
				}
			});
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `Something went wrong! ${error} `,
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
	);

	return (
		sessionData ? (
			<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
				<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-16">
					Book <span className="text-[hsl(280,100%,70%)]">Boarding</span>
				</h1>
				<p className="text-white text-center w-[80%] font-bold sm:text-[2.5rem]">
					Fill out the form below and someone from the MNMK-9 team will confirm your booking.
				</p>
				{key && key !== undefined ? (
					<GoogleReCaptchaProvider reCaptchaKey={key}>
						<BoardingForm petData={petData ?? []} setToken={setToken} isSubmitting={isSubmitting} register={register} handleSubmit={handleSubmit} onSubmit={onSubmit} handleChange={handleChange} />
					</GoogleReCaptchaProvider>
				) : null}
			</div >
		) : (
			<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
				<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Please Login to book a boarding appointment</h1>
			</div>
		)
	)
}

export default Boarding;