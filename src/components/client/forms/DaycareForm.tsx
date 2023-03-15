"use-client";
import { trpc } from "../../../utils/trpc";
import type { Pet } from "@prisma/client";

type Props = {
	petData: Array<Pet>,
	isSubmitting: boolean,
	register: any,
	handleSubmit: any,
	onSubmit: any,
	handleChange: any
}

const DaycareForm = ({ register, handleSubmit, onSubmit, handleChange, petData, isSubmitting }: Props) => {
	const id = petData && petData?.map(pet => pet.ownerId)[0] as string;
	const { data: userData } = trpc.user.byId.useQuery({ id });

	return (
		<form className="w-full md:w-[80%]" onSubmit={handleSubmit(onSubmit)}>
			<div className="grid md:grid-cols-2 md:gap-6">
				<div className="relative z-0 mb-6 w-full group">
					<input
						{...register("firstName", { required: true })}
						type="text"
						name="firstName"
						defaultValue={userData?.name.split(" ")[0] as string}
						id="floating_first_name"
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
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
						defaultValue={userData?.name.split(" ")[1] as string}
						id="floating_last_name"
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
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
						defaultValue={userData?.phoneNumber as string}
						id="floating_phone"
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
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
						defaultValue={userData?.email as string}
						id="floating_email"
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
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
						Date
					</label>
				</div>
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
						{petData?.map((pet) => {
							const { name } = pet;
							return (
								<option key={name} className="text-gray-900 w-[10%]" defaultValue={name}>{name}</option>
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
			</div>

			<div className="grid md:grid-cols-2 md:gap-6">
				<div className="relative z-0 mb-6 w-full group">
					<input
						{...register("startTime", { required: true })}
						type="time"
						name="startTime"
						id="startTime"
						className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
						required
					/>
					<label
						htmlFor="startTime"
						className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
						Drop Off Time
					</label>
				</div>
				<div className="relative z-0 mb-6 w-full group">
					<input
						{...register("endTime", { required: true })}
						type="time"
						name="endTime"
						id="endTime"
						className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
						required
					/>
					<label
						htmlFor="endTime"
						className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
						Pick Up Time
					</label>
				</div>
			</div>
			<div className="grid md:grid-cols-1 md:gap-6">
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
	)
}

export default DaycareForm