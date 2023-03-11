"use-client";

import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../../utils/trpc';
import Swal from "sweetalert2";
import { sendEmailGrooming } from "../../lib/email";
import GroomingForm from "../../components/client/forms/GroomingForm";
import { FormSchemaType } from "../../types/form-schema";
import { groomingSchema } from "../../utils/schema";
import type { Pet } from "@prisma/client";

const Grooming: NextPage = () => {
	const router = useRouter();

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

	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({
		resolver: zodResolver(groomingSchema)
	});

	const addNewGroomingBooking = trpc.bookings.newBooking.useMutation();

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
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const petName = e.target.value;

		const petSelected = petData?.find(pet => pet.name === petName);

		const petSelectedId = petSelected?.id;

		petSelectedId && setPetID(petSelectedId);
	}

	const onSubmit: SubmitHandler<FormSchemaType> = async (formData): Promise<void> => {

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

			formData && addNewGroomingBooking.mutate(formData);

			// reset form
			reset();

			await sendEmailGrooming(
				formData?.email,
				// process.env.NEXT_PUBLIC_EMAIL_TO as string,
				"matt.vinall7@gmail.com",
				formData?.firstName,
				formData?.lastName,
				formData?.email,
				formData?.phoneNumber,
				formData?.petName,
				formData?.checkInDate,
				formData?.startTime || "",
				formData?.endTime || "",
				formData?.notes
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
					Book <span className="text-[hsl(280,100%,70%)]">Grooming</span>
				</h1>

				<p className="text-white text-center w-[80%] font-bold sm:text-[2.5rem]">
					Fill out the form below and someone from the MNMK-9 team will confirm your booking.
				</p>
				<GroomingForm petData={petData as [Pet]} isSubmitting={isSubmitting} register={register} handleSubmit={handleSubmit} onSubmit={onSubmit} handleChange={handleChange} />
			</div >
		) : (
			<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
				<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Please Login to book a grooming appointment.</h1>
			</div>
		)
	)
}

export default Grooming;