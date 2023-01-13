'use client';

import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '../../utils/trpc';
import { sendEmailBoarding } from "../../helpers/email";
import Swal from "sweetalert2";
import BoardingForm from "../../components/forms/BoardingForm";

type FormSchemaType = {
	firstName: string,
	lastName: string,
	phoneNumber: string,
	email: string,
	checkInDate: string,
	checkOutDate: string,
	petName: string,
	notes?: string,
	serviceName: string,
	userId: string,
	serviceId: string,
	petId: string
}

// define schema for the form 
const schema = z.object({
	firstName: z.string().min(1, { message: "First name is required" }),
	lastName: z.string().min(1, { message: "Last name is required" }),
	phoneNumber: z.string(),
	email: z.string().min(1, { message: "Email is required" }).email({
		message: "Must be a valid email",
	}),
	checkInDate: z.string(),
	checkOutDate: z.string(),
	petName: z.string(),
	notes: z.string(),
})

const Boarding: NextPage = () => {
	// get email from session data
	const { data: sessionData } = useSession();
	const id = sessionData?.user?.id as string;

	const router = useRouter();

	// query user table by email to get user data
	const { data, isLoading, error } = trpc.user.byId.useQuery({ id })
	console.log("user data", data);

	// query service table and find the service name of boarding and store the service ID
	const { data: serviceData } = trpc.service.getAllServices.useQuery();
	console.log("service data", data);

	const boarding = serviceData?.find(service => service.serviceName === "Boarding");
	const boardingId = boarding?.id as string;

	// query the pets table and find the 
	const { data: petData } = trpc.pet.byOwnerId.useQuery({ id });
	console.log("pet data", petData);

	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({
		resolver: zodResolver(schema)
	});

	const addNewBooking = trpc.bookings.newBooking.useMutation();

	const [petId, setPetID] = useState<String>("");

	useEffect(() => {
		if (petData && petData?.length > 1) {
			// store the pet ID of the first pet in the petData array as default
			const initialPetId = petData && petData[0]?.id;


			initialPetId && setPetID(initialPetId);
		}
	}, [])

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
		console.log("pet selected ID", petSelectedId);

		// if petSelectedId is truthy, set the state
		petSelectedId && setPetID(petSelectedId);
	}

	const onSubmit: SubmitHandler<FormSchemaType> = async (formData: any) => {

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
			addNewBooking.mutate(formData);

			// reset the form state
			reset();

			// call send email function that leverages AWS SES to send the form data via email
			await sendEmailBoarding(
				"matt.vinall7@gmail.com",
				"matt.vinall7@gmail.com",
				formData?.firstName,
				formData?.lastName,
				formData?.email,
				formData?.phoneNumber,
				formData?.petName,
				formData?.checkInDate,
				formData?.checkOutDate,
				formData?.notes
			);

			// success message 
			Swal.fire({
				icon: 'success',
				title: `PAWesome 🐶`,
				text: `Successfully Booked ${formData.petName} for Boarding. An email confirmation with your booking details will be sent to your email.`,
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
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-16">
				Book <span className="text-[hsl(280,100%,70%)]">Boarding</span>
			</h1>
			<p className="text-white text-center w-[80%] font-bold sm:text-[2.5rem]">
				Fill out the form below and someone from the MNMK-9 team will confirm your booking.
			</p>
			<BoardingForm petData={petData} isSubmitting={isSubmitting} register={register} handleSubmit={handleSubmit} onSubmit={onSubmit} handleChange={handleChange} />
		</div >
	)
}

export default Boarding;