import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from 'next/router';

type Props = {
	setShowUserForm: (bool: boolean) => void;
}
const UserDetailForm = ({ setShowUserForm }: Props) => {
	type UserFormSchema = {
		address: string,
		city: string,
		postalCode: string,
		phoneNumber: string,
	}

	const schema = z.object({
		address: z.string().min(6).max(65),
		city: z.string().min(1),
		postalCode: z.string().min(6).max(7),
		phoneNumber: z.string().max(12)
	});

	const router = useRouter();

	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormSchema>({
		resolver: zodResolver(schema)
	});

	const { data: sessionData } = useSession()
	const id = sessionData?.user?.id as string;
	const { data: userData } = trpc.user.byId.useQuery({ id });

	const editProfile = trpc.user.editProfile.useMutation();

	const onSubmit: SubmitHandler<UserFormSchema> = async (formData: any) => {
		formData.id = userData?.id;

		editProfile.mutate(formData);

		try {
			// success message 
			Swal.fire({
				icon: 'success',
				title: `✅`,
				text: `Successfully Added your profile information.`,
			}).then((result) => {
				if (result.isConfirmed) {
					// navigate to previous page
					router.reload()
				}
			});

			reset();
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `Something went wrong! ${error}`,
			});
		}
	}

	const handleCloseForm = () => {
		setShowUserForm(false);
	}

	return (
		<form style={{ position: "relative" }} className="w-[60%] md:w-[90%]" onSubmit={handleSubmit(onSubmit)}>
			<svg onClick={handleCloseForm} style={{ cursor: "pointer", position: "absolute", right: "0", top: "-20%", color: "white" }} className="w-6 h-6" fill="#fff" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
			<button
				disabled={isSubmitting}
				type="submit"
				className="mt-[25px] rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
				Submit
			</button>
		</form>
	)
}

export default UserDetailForm