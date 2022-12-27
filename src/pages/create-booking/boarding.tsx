import { type NextPage } from "next";
import { useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '../../utils/trpc';

type FormSchemaType = {
	firstName: string,
	lastName: string,
	phoneNumber: string,
	email: string,
	scheduledDate: string,
	endDate: string,
	petName: string,
	notes?: string
	userId: string,
	serviceId: string,
	petId: string
}

// define schema for the form 
const schema = z.object({
	firstName: z.string().min(1, { message: "Firstname is required" }),
	lastName: z.string().min(1, { message: "Lastname is required" }),
	phoneNumber: z.string(),
	email: z.string().min(1, { message: "Email is required" }).email({
		message: "Must be a valid email",
	}),
	checkInDate: z.string(),
	checkOutDate: z.string(),
	petName: z.string(),
	notes: z.string(),
	userId: z.string(),
	serviceId: z.string(),
	petId: z.string(),
})


const Boarding: NextPage = () => {
	// get email from session data
	const { data: sessionData } = useSession();
	const email = sessionData?.user?.email;

	// query user table by email to get user data
	const { data, isLoading, error } = trpc.user.byEmail.useQuery({ email })
	// console.log("user data", data)

	const { register, handleSubmit, reset, formState: { errors } } = useForm<FormSchemaType>({
		resolver: zodResolver(schema)
	});

	const utils = trpc.useContext();

	const addNewBooking = trpc.bookings.newBooking.useMutation({
		onMutate: () => {
			utils.bookings.getAllBookings.cancel();
			const optimisticUpdate = utils.bookings.getAllBookings.getData()

			if (optimisticUpdate) {
				utils.bookings.getAllBookings.setData(optimisticUpdate);
			}
		},
		onSettled: () => {
			utils.bookings.getAllBookings.invalidate();
		}
	})

	console.log("add new booking", addNewBooking);


	const handleFormSubmit: SubmitHandler<FormSchemaType> = async (data) => {
		console.log("form data", data);
		const { firstName, lastName, phoneNumber, email, checkInDate, checkOutDate, petName, notes } = formData;

		addNewBooking.mutate({
			firstName,
			lastName,
			phoneNumber,
			email,
			checkInDate,
			petName,
			checkOutDate,
			notes,
			userId: "clbxy97w40000ut7sumd8kd83",
			petId: "f8de421d-7cd4-4c06-81ac-975fa069b0a4",
			serviceId: "006605da-dd50-479b-a55c-7bf8e572a3e9"
		});

		reset();
	}

	if (isLoading) return <p>Loading...</p>;

	if (error) return <p>Error fetching user data...</p>;

	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-16">
				Book <span className="text-[hsl(280,100%,70%)]">Boarding</span>
			</h1>

			<p className="text-white text-center w-[80%] font-bold sm:text-[2.5rem]">
				Fill out the form below and someone from the MNMK-9 team will confirm your booking.
			</p>
			<form className="w-[60%] md:w-[90%]" onSubmit={handleSubmit(handleFormSubmit)}>
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
						>
							{data?.pets && data.pets.map((pet) => {
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
					type="submit"
					className="mt-[25px] rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
					Submit
				</button>

			</form>
		</div>
	)
}

export default Boarding;