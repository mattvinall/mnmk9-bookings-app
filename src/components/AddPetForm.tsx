import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

const AddPetForm: React.FC = () => {
	type UserFormSchema = {
		name: string,
		breed: string,
		vaccinated: boolean,
	}

	const schema = z.object({
		name: z.string().min(1),
		breed: z.string().min(1),
		vaccinated: z.literal(false)
	});

	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormSchema>({
		resolver: zodResolver(schema)
	});

	const { data: sessionData } = useSession()
	const id = sessionData?.user?.id;
	const { data: userData } = trpc.user.byId.useQuery({ id });

	// const editProfile = trpc.user.editProfile.useMutation();

	// const onSubmit: SubmitHandler<UserFormSchema> = async (formData: any) => {
	// 	formData.id = userData?.id;

	// 	editProfile.mutate(formData);

	// 	reset();
	// }

	return (
		<form className="w-[60%] md:w-[90%]"
		// onSubmit={handleSubmit(onSubmit)}
		>
			<div className="grid md:grid-cols-1 md:gap-6">
				<div className="relative z-0 mb-6 w-full group">
					<input
						{...register("name", { required: true })}
						type="text"
						name="address"
						id="floating_address"
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
						required
					/>
					<label
						htmlFor="floating_address"
						className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
						Name
					</label>
				</div>
				<div className="relative z-0 mb-6 w-full group">
					<input
						{...register("breed", { required: true })}
						type="text"
						name="city"
						id="floating_city"
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
						required
					/>
					<label
						htmlFor="floating_city"
						className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
						Breed
					</label>
				</div>

				<p className="text-white font-bold">vaccinated</p>
				<div className="flex items-center mr-4">
					<input
						{...register("vaccinated", { required: true })}
						type="radio"
						name="vaccinated-yes"
						value="yes"
						id="floating_vaccinated-yes"
						className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
						required
					/>
					<label
						htmlFor="floating_vaccinated-yes"
						className="ml-2 mr-4 text-sm font-medium text-gray-900 dark:text-gray-300">
						Yes
					</label>
					<input
						{...register("vaccinated", { required: true })}
						type="radio"
						name="vaccinated-no"
						value="no"
						id="floating_vaccinated-no"
						className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
						required
					/>
					<label
						htmlFor="floating_vaccinated-no"
						className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
						No
					</label>
				</div>
			</div>

			<button
				disabled={isSubmitting}
				type="submit"
				className="mt-[25px] rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
				Submit
			</button>
		</form>
	)
}

export default AddPetForm;