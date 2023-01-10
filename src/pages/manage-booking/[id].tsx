import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

const BookingDetail: NextPage = () => {
	const router = useRouter();
	const bookingId = router.query.id as string;
	const { data: bookingDetail, isLoading, error } = trpc.bookings.byId.useQuery({ id: bookingId });

	console.log("booking detail", bookingDetail);

	const [data, setData] = useState({
		checkInDate: bookingDetail?.checkInDate,
		checkOutDate: bookingDetail?.checkOutDate,
		startTime: bookingDetail?.startTime,
		endTime: bookingDetail?.endTime,
		notes: bookingDetail?.notes,
	});

	useEffect(() => {
		setData(data);
	}, []);

	type FormSchemaType = {
		checkInDate?: string,
		checkOutDate?: string,
		startTime?: string,
		endTime?: string
		notes?: string,
	}

	// define schema for the form 
	const schema = z.object({
		checkInDate: z.string().optional(),
		checkOutDate: z.string().optional(),
		startTime: z.string().optional(),
		endTime: z.string().optional(),
		notes: z.string().optional(),
	})

	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({
		resolver: zodResolver(schema)
	});

	const editBooking = trpc.bookings.editBooking.useMutation();

	const cancelBooking = trpc.bookings.cancelBooking.useMutation()

	const onSubmit: SubmitHandler<FormSchemaType> = async (formData: any) => {

		// mutate / POST request to bookings api endpoint and submit the form data
		formData.id = bookingDetail?.id;

		editBooking.mutate(formData);

		// reset the form state
		reset();
	}

	const [showForm, setShowForm] = useState(false);

	const handleEditBooking = () => {
		setShowForm((prev) => !prev);
		console.log("show form state", showForm);
	}

	const handleCancelBooking = (id: String) => {
		try {
			const bookingId = id as string;
			cancelBooking.mutate({ id: bookingId });

			router.back()

			console.log("cancel booking", cancelBooking);
		} catch (error) {
			console.log("error cancelling booking", error)
		}
	}

	if (isLoading) return <p className="text-xl5 text-white flex align-center">Loading ...</p>;

	if (error) return <p className="text-xl3 text-white flex align-center"> Error... {error.message}</p >

	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<Link className="flex justify-start text-left text-white font-bold text-2xl" href="/manage-booking">Go Back</Link>
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-8">
				Manage Booking: <span className="text-[hsl(280,100%,70%)]">{bookingDetail?.serviceName}</span>
			</h1>

			<p className="text-white text-center w-[80%] font-bold sm:text-[2.5rem]">
				Need to switch your booking date or time?<br />
				Click the buttons if you want to edit or cancel your booking.
			</p>

			<div className="flex justify-center">
				<button
					onClick={handleEditBooking}
					className="mt-[25px] rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
					Edit Booking
				</button>
				<button
					onClick={() => handleCancelBooking(bookingDetail?.id || "")}
					className="mt-[25px] rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
					Cancel Booking
				</button>

			</div>
			{showForm ? (

				<form className="w-[80%] md:w-[90%]" onSubmit={handleSubmit(onSubmit)}>

					<div className={bookingDetail?.checkOutDate ? `grid md:grid-cols-2 md:gap-6` : `grid md:grid-cols-1 md:gap-6`}>
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
								className="peer-focus:font-medium absolute text-md text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
								Check In Date
							</label>
						</div>
						{bookingDetail?.checkOutDate ? (
							<div className="relative z-0 mb-6 w-full group">
								<input
									{...register("checkOutDate")}
									type="date"
									name="checkOutDate"
									id="checkOutDate"
									className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
									required={bookingDetail?.checkOutDate !== null ? true : false}
									disabled={bookingDetail?.checkOutDate === null ? true : false}
								/>
								<label
									htmlFor="checkOutDate"
									className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
									Check Out Date
								</label>
							</div>
						) : null}
					</div>
					{bookingDetail?.serviceName !== "Boarding" ? (
						<div className="grid md:grid-cols-2 md:gap-6">
							<div className="relative z-0 mb-6 w-full group">
								<input
									{...register("startTime")}
									type="time"
									name="startTime"
									id="startTime"
									className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
									required={bookingDetail?.startTime !== null ? true : false}
								/>
								<label
									htmlFor="startTime"
									className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
									Start Time / Drop off Time: {bookingDetail?.endTime}
								</label>
							</div>
							<div className="relative z-0 mb-6 w-full group">
								<input
									{...register("endTime", { required: true })}
									type="time"
									name="endTime"
									id="endTime"
									className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
									required={bookingDetail?.endTime !== null ? true : false}
								/>
								<label
									htmlFor="endTime"
									className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
									End Time / Pick Up Time: {bookingDetail?.endTime}
								</label>
							</div>
						</div>
					) : null}

					<div className="grid md:grid-cols-1 md:gap-6">
						<div className="relative z-0 mb-6 w-full group">
							<textarea
								{...register("notes")}
								type="textarea"
								rows="1"
								name="notes"
								defaultValue={bookingDetail?.notes || ""}
								id="notes"
								className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
							/>
							<label
								htmlFor="notes"
								className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
								Add Notes / Special Instructions
							</label>
						</div>
					</div>
					<button
						disabled={isSubmitting}
						type="submit"
						className="mt-[25px] rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
						Update
					</button>
				</form >
			) : null}
		</div>
	)
}

export default BookingDetail;