"use client";

import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../../utils/trpc';
import Swal from "sweetalert2";
import { sendEmailToAdmin, sendEmailToClient } from "../../lib/email";
import GroomingForm from "../../components/client/forms/GroomingForm";
import { bookingFormSchema, BookingFormType } from "../../utils/schema";
import {
	GoogleReCaptchaProvider,
} from 'react-google-recaptcha-v3';
import { Pet } from "@prisma/client";
import { useAuth, useUser } from "@clerk/nextjs";
import { getAllServices } from "../../api/services";
import { getUserById } from "../../api/users";
import { Invoice, addTax, calculateServiceDuration, calculateSubtotal, generateInvoice } from "../../utils/invoice";

const Grooming: NextPage = () => {
	const router = useRouter();

	const [token, setToken] = useState<string>("");
	const [key, setKey] = useState<string>("");
	const [secret, setSecret] = useState<string>("");
	const [petId, setPetID] = useState<string>("");

	const { isSignedIn } = useUser();
	const { userId } = useAuth();

	const { data: userData } = getUserById(userId as string);

	// query service table and find the service name of boarding and store the service ID
	const { data: serviceData } = getAllServices();

	const grooming = serviceData?.find(service => service.serviceName === "Grooming");

	const groomingId = grooming?.id as string;
	const groomingPrice = grooming?.price as number;

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

	const addNewGroomingBooking = trpc.bookings.newBooking.useMutation({
		onSuccess: (data) => {
			const checkInDate = new Date(data?.checkInDate as string);
			const checkOutDate = new Date(data?.checkOutDate as string);
			const serviceDuration = calculateServiceDuration(checkInDate, checkOutDate);

			const invoice = {
				bookingId: data?.id as string,
				petName: data?.petName as string,
				serviceName: data?.serviceName as string,
				servicePrice: groomingPrice,
				serviceDuration: serviceDuration,
				customerName: `${data?.firstName} ${data?.lastName}`,
				customerEmail: data?.email as string,
				customerAddress: userData?.address as string,
				customerCity: userData?.city as string,
				subtotal: calculateSubtotal(groomingPrice, serviceDuration) as number,
				total: addTax(calculateSubtotal(groomingPrice, serviceDuration) as number),
				createdAt: new Date().toLocaleDateString() as string,
				dueDate: data?.checkOutDate && new Date(data?.checkOutDate).toLocaleDateString() as string,
			}

			if (invoice) {
				generateInvoice(invoice as Invoice);
			}
		}
	});

	const verifyRecaptcha = trpc.recaptcha.verify.useMutation();

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

	const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<BookingFormType>({
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

	const onSubmit: SubmitHandler<BookingFormType> = async (formData: BookingFormType) => {

		try {
			// if there is only 1 pet set the id, if there is multiple pet use the petId in state based on user selection
			const id = petData && petData[0]?.id;
			const serviceName = "Grooming";


			verifyRecaptcha.mutate({ token, secret });

			// mutate / POST request to bookings api endpoint and submit the form data
			userId && addNewGroomingBooking.mutate({
				...formData,
				userId: userId as string,
				petId: petId ? petId : id,
				serviceId: groomingId,
				serviceName
			});

			// reset the form state
			reset();

			// call send email function that leverages AWS SES to send the form data via email
			await sendEmailToAdmin(
				// [formData?.email, `${process.env.NEXT_PUBLIC_EMAIL_TO}`],
				// `${process.env.NEXT_PUBLIC_EMAIL_TO}`,
				formData?.email,
				"matt.vinall7@gmail.com",
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
				// [formData?.email, `${process.env.NEXT_PUBLIC_EMAIL_TO}`],
				// `${process.env.NEXT_PUBLIC_EMAIL_TO}`,
				formData?.email,
				"matt.vinall7@gmail.com",
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
		isSignedIn ? (
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