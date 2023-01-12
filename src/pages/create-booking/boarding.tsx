import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '../../utils/trpc';
import { ses } from "../../server/aws/ses";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

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
	const handleChange = (e: any) => {
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

	const sendEmail = async (
		emailTo: string,
		emailFrom: string,
		firstName: string,
		lastName: string,
		email: string,
		phoneNumber: string,
		petName: string,
		checkInDate: string,
		checkOutDate: string,
		notes?: string,
	) => {
		const htmlTemplate = `
    <html>
      <body style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1 style="text-align: center; font-size: 24px;">Booking Details</h1>
        <div style="border: 1px solid #ccc; padding: 20px;">
          <p style="font-size: 18px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p style="font-size: 18px;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 18px;"><strong>Phone Number:</strong> ${phoneNumber}</p>
          <p style="font-size: 18px;"><strong>Pet Name:</strong> ${petName}</p>
          <p style="font-size: 18px;"><strong>Check-In Date:</strong> ${checkInDate}</p>
          <p style="font-size: 18px;"><strong>Check-Out Date:</strong> ${checkOutDate}</p>
          <p style="font-size: 18px;"><strong>Notes:</strong> ${notes}</p>
        </div>
      </body>
    </html>
  `
		const emailParams = {
			Destination: {
				ToAddresses: [emailTo]
			},
			Message: {
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: htmlTemplate
					}
				},
				Subject: {
					Charset: 'UTF-8',
					Data: `Booking for Boarding: ${firstName} ${lastName} | Pet: ${petName}`
				}
			},
			Source: emailFrom
		}

		return await ses.sendEmail(emailParams).promise();
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

			// call send email function that leverages AWS SES to send the form data via email
			await sendEmail(
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
				text: `Successfully Booked ${formData.petName} for Daycare. An email confirmation with your booking details will be sent to your email.`,
				footer: '<a href="">Why do I have this issue?</a>'
			})

			// reset the form state
			reset();

			router.push("/");

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
			<form className="w-[60%] md:w-[90%]" onSubmit={handleSubmit(onSubmit)}>
				<div className="grid md:grid-cols-2 md:gap-6">
					<div className="relative z-0 mb-6 w-full group">
						<input
							{...register("firstName", { required: true })}
							type="text"
							name="firstName"
							id="floating_first_name"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
							required
						/>
						<label
							htmlFor="floating_first_name"
							className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
							First name
						</label>
					</div>
					<div className="relative z-0 mb-6 w-full group">
						<input
							{...register("lastName", { required: true })}
							type="text"
							name="lastName"
							id="floating_last_name"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
							required
						/>
						<label
							htmlFor="floating_last_name"
							className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
							Last name
						</label>
					</div>
				</div>
				<div className="grid md:grid-cols-2 md:gap-6">
					<div className="relative z-0 mb-6 w-full group">
						<input
							{...register("phoneNumber", { required: true })}
							type="tel"
							pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
							name="phoneNumber"
							id="floating_phone"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
							required
						/>
						<label
							htmlFor="floating_phone"
							className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
							Phone number (123-456-7890)
						</label>
					</div>
					<div className="relative z-0 mb-6 w-full group">
						<input
							{...register("email", { required: true })}
							type="email"
							name="email"
							id="floating_email"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
							required
						/>
						<label
							htmlFor="floating_email"
							className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
							Email address
						</label>
					</div>
				</div>
				<div className="grid md:grid-cols-2 md:gap-6">
					<div className="relative z-0 mb-6 w-full group">
						<input
							{...register("checkInDate", { required: true })}
							type="date"
							name="checkInDate"
							id="checkInDate"
							className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
							required
						/>
						<label
							htmlFor="checkInDate"
							className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
							Check In Date
						</label>
					</div>
					<div className="relative z-0 mb-6 w-full group">
						<input
							{...register("checkOutDate", { required: true })}
							type="date"
							name="checkOutDate"
							id="checkOutDate"
							className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
							required
						/>
						<label
							htmlFor="checkOutDate"
							className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
							Check Out Date
						</label>
					</div>
				</div>
				<div className="grid md:grid-cols-2 md:gap-6">
					<div className="relative z-0 mb-6 w-full group">
						<label
							htmlFor="pet-select"
							className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
							Select Pet
						</label>
						<select
							{...register("petName", { required: true })}
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
							id="pet-select"
							onChange={handleChange}
						>
							{petData && petData?.map((pet) => {
								const { name } = pet;
								return (
									<option key={name} className="text-gray-900 w-[10%]" value={name}>{name}</option>
								)
							})}
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
						<textarea
							{...register("notes")}
							type="textarea"
							rows="1"
							name="notes"
							id="notes"
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
						/>
						<label
							htmlFor="notes"
							className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
							Notes/Special Instructions
						</label>
					</div>
				</div>

				<button
					disabled={isSubmitting}
					type="submit"
					className="mt-[25px] rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
					Submit
				</button>
			</form >
		</div >
	)
}

export default Boarding;