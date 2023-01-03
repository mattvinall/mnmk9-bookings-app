import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const UserDetailForm = () => {
	type UserFormSchema = {
		address: string,
		city: string,
		postalCode: string,
		phoneNumber: string,
	}

	const schema = z.object({
		address: z.string().min(6).max(65),
		city: z.string().min(1),
		postalCode: z.string(),
		phoneNumber: z.string()
	});

	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormSchema>({
		resolver: zodResolver(schema)
	});

	const onSubmit: SubmitHandler<UserFormSchema> = async (formData: any) => {
		console.log("form data", formData);
	}

	return (
		<form className="w-[60%] md:w-[90%]" onSubmit={handleSubmit(onSubmit)}>
			<div className="grid md:grid-cols-2 md:gap-6">
				<div className="relative z-0 mb-6 w-full group">
					<input
						{...register("address", { required: true })}
						type="text"
						name="address"
						id="floating_address"
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
						required
					/>
					<label
						htmlFor="floating_address"
						className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
						Address
					</label>
				</div>
				<div className="relative z-0 mb-6 w-full group">
					<input
						{...register("city", { required: true })}
						type="text"
						name="city"
						id="floating_city"
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
						required
					/>
					<label
						htmlFor="floating_city"
						className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
						City
					</label>
				</div>
			</div>
			<div className="grid md:grid-cols-2 md:gap-6">
				<div className="relative z-0 mb-6 w-full group">
					<input
						{...register("postalCode", { required: true })}
						type="text"
						name="postalCode"
						id="floating_postal_code"
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
						required
					/>
					<label
						htmlFor="floating_postal_code"
						className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
						Postal Code
					</label>
				</div>
				<div className="relative z-0 mb-6 w-full group">
					<input
						{...register("phoneNumber", { required: true })}
						type="tel"
						name="phoneNumber"
						id="floating_phone_number"
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
						required
					/>
					<label
						htmlFor="floating_phone_number"
						className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
						Phone Number
					</label>
				</div>
			</div>
		</form>
	)
}

export default UserDetailForm