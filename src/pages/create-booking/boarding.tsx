'use client';

import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../../utils/trpc';
import Swal from "sweetalert2";
import BoardingForm from "../../components/client/forms/BoardingForm";
import { bookingFormSchema, BookingFormType } from "../../utils/schema";
import { sendEmailToAdmin, sendEmailToClient } from './../../lib/email';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Pet, Services } from "@prisma/client"
import { useAuth, useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "../../components/client/ui/LoadingSpinner";

const Boarding: NextPage = () => {
	const { isSignedIn } = useUser();
	const { userId } = useAuth();
	const router = useRouter();

	const [petId, setPetID] = useState<string>("");
	const [token, setToken] = useState<string>("");
	const [key, setKey] = useState<string>("");
	const [secret, setSecret] = useState<string>("");

	// query service table and find the service name of boarding and store the service ID
	const { data: serviceData } = trpc.service.getAllServices.useQuery();

	console.log("service data", serviceData);

	const boarding = serviceData?.find((service: Services) => service.serviceName === "Boarding");

	console.log("boarding", boarding);

	const boardingId = boarding?.id as string;

	// query the pets table and find the 
	const { data: petData, isLoading, error } = trpc.pet.byOwnerId.useQuery({ id: userId as string }, {
		onSettled(data, error) {
			if (!data || data.length === 0) {
				Swal.fire({
					icon: 'warning',
					title: 'Warning',
					text: 'Looks like you have not added a pet to your profile. You will now be routed to your profile page. Go to the tab "Add Pet" before trying to book a service!',
				}).then(response => {
					if (response.isConfirmed) {
						router.push(`/profile/${userId}`);
					}
				});
			}
		},
	});

	const addNewBooking = trpc.bookings.newBooking.useMutation();

	const verifyRecaptcha = trpc.recaptcha.verify.useMutation();

	useEffect(() => {
		const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;
		const secret = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET;

		if (!key) return;
		if (!secret) return;

		setKey(key);
		setSecret(secret);
	}, [key, secret]);

	useEffect(() => {
		if (petData && petData?.length > 1) {
			// store the pet ID of the first pet in the petData array as default
			const initialPetId = petData && petData[0]?.id;

			initialPetId && setPetID(initialPetId);
		}
	}, [petData])

	const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<BookingFormType>({
		resolver: zodResolver(bookingFormSchema)
	});

	// on change grab the pet name, use the pet name to find the pet in the array and store the ID
	// set the ID of the pet selected to state
	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		// get the pet name from the target value
		const petName = e.target.value;

		// find the pet in the petData array based on the name to set the selected pet
		const petSelected = petData?.find((pet: Pet) => pet.name === petName);

		// store the ID of the pet
		const petSelectedId = petSelected?.id;

		// if petSelectedId is truthy, set the state
		petSelectedId && setPetID(petSelectedId);
	}

	const onSubmit: SubmitHandler<BookingFormType> = async (formData: BookingFormType) => {
		console.log("form data", formData);

		try {
			// if there is only 1 pet set the id, if there is multiple pet use the petId in state based on user selection
			const id = petData && petData[0]?.id;
			const serviceName = "Boarding";

			token && secret && verifyRecaptcha.mutate({ token, secret });

			// mutate / POST request to bookings api endpoint and submit the form data
			userId && addNewBooking.mutate({
				...formData,
				petId: petId ? petId : id,
				userId: userId as string,
				serviceId: boardingId,
				serviceName: "Boarding",

			});

			// reset the form state
			reset();

			console.log("form data check in date", formData.checkInDate)

			// call send email function that leverages AWS SES to send the form data via email
			await sendEmailToAdmin(
				"tylermelnike@mnmk9.ca",
				"tylermelnike@mnmk9.ca",
				formData?.firstName,
				formData?.lastName,
				formData?.email,
				formData?.phoneNumber,
				formData?.petName,
				formData?.checkInDate,
				formData?.checkOutDate,
				formData.startTime,
				formData.endTime,
				serviceName,
				formData?.notes
			);

			await sendEmailToClient(
				formData?.email,
				"tylermelnike@mnmk9.ca",
				formData?.petName,
				formData?.checkInDate,
				formData?.startTime,
				formData?.endTime,
				serviceName,
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
				text: `Something went wrong! ${error} `,
			});
		}
	}

	if (isLoading) return (
		<LoadingSpinner />
	);

	if (error) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Error....please contact support</h1>
		</div>
	);

	return (
		isSignedIn ? (
			<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
				<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-16">
					Book <span className="text-[rgb(238,182,43)]">Boarding</span>
				</h1>
				<p className="text-white text-center w-[80%] font-bold sm:text-[2.5rem]">
					Fill out the form below and someone from the MNMK-9 team will confirm your booking.
				</p>
				{key && key !== undefined && key !== "" ? (
					<GoogleReCaptchaProvider reCaptchaKey={key}>
						<BoardingForm petData={petData ?? []} setValue={setValue} setToken={setToken} isSubmitting={isSubmitting} register={register} handleSubmit={handleSubmit} onSubmit={onSubmit} handleChange={handleChange} />
					</GoogleReCaptchaProvider>
				) : null}
			</div>
		) : (
			<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
				<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Please Login to book a boarding appointment</h1>
			</div>
		)
	)
}

export default Boarding;