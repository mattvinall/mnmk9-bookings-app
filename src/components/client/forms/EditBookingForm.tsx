"use client";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import { EditBookingFormTypeProps } from "../../../types/form-types";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { GoogleReCaptcha, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCallback, useEffect } from "react";
import { formatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";

const EditBookingForm = ({ register, handleSubmit, onSubmit, isSubmitting, setShowForm, setToken }: EditBookingFormTypeProps): ReactJSXElement => {
	const router = useRouter();
	const bookingId = router.query.id as string;
	const { data: bookingDetail } = trpc.bookings.byId.useQuery({ id: bookingId });

	const { executeRecaptcha } = useGoogleReCaptcha()
	// Create an event handler so you can call the verification on button click event or form submit
	const handleReCaptchaVerify = useCallback(async () => {
		if (!executeRecaptcha) {
			console.log('Execute recaptcha not yet available');
			return;
		}

		const token = await executeRecaptcha('editBookingForm');
		setToken(token)
		console.log("token", token);
		// Do whatever you want with the token
	}, [executeRecaptcha]);

	// You can use useEffect to trigger the verification as soon as the component being loaded
	useEffect(() => {
		handleReCaptchaVerify();
	}, [handleReCaptchaVerify]);

	return (
		<form className="w-[80%] md:w-[90%]" style={{ position: "relative" }} onSubmit={handleSubmit(onSubmit)}>
			<GoogleReCaptcha onVerify={handleReCaptchaVerify} action="editBookingForm" />
			<svg onClick={() => setShowForm(false)} className="w-6 h-6" fill="#fff" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer", position: "absolute", right: "0px", top: "0%", color: "white" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
			<h2 className="text-[2rem] text-white font-bold">Booking Details</h2>
			<ul className="my-8 lg:my-8">
				<li className="flex w-[350px] justify-center flex-col gap-4 rounded-xl bg-white/10 p-2 text-white hover:bg-white/20">
					<div className="flex justify-center">
						<div className="rounded-lg shadow-lg bg-white max-w-md w-full h-full min-h-[300px]">
							<div className="p-6">
								<span className="inline-block text-xl font-bold uppercase text-gray-900 mb-2">{bookingDetail?.serviceName} | </span><span className="inline-block text-xl font-bold uppercase text-gray-900 mb-2"> &nbsp;{bookingDetail?.petName}</span>
								<p className="text-md text-gray-700 mb-2"><span className="font-bold">Confirmed:</span> {bookingDetail?.confirmedBooking ? "✅" : "❌"}</p>
								<p className="text-md text-gray-700 mb-2"><span className="font-bold">Check In:</span> {formatDate(bookingDetail?.checkInDate as string)}</p>
								<p className="text-md text-gray-700 mb-2"><span className="font-bold">Check Out:</span> {bookingDetail?.checkOutDate ? formatDate(bookingDetail?.checkOutDate as string) : "--"}</p>
								<p className="text-md text-gray-700 mb-2"><span className="font-bold">Start Time:</span> {bookingDetail?.startTime ? formatTime(bookingDetail?.startTime as string) : "--"}</p>
								<p className="text-md text-gray-700 mb-2"><span className="font-bold">End Time:</span> {bookingDetail?.endTime ? formatTime(bookingDetail?.endTime as string) : "--"}</p>
								<p className="text-md text-gray-700 mb-2"><span className="font-bold">Notes:</span> {bookingDetail?.notes ? bookingDetail?.notes : "--"}</p>
							</div>
						</div>
					</div>
				</li>
			</ul>
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
						{bookingDetail?.serviceName !== "Boarding" && bookingDetail?.serviceName !== "Daycare" ? "Start Time" : "Drop Off Time"}
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
						{bookingDetail?.serviceName !== "Boarding" && bookingDetail?.serviceName !== "Daycare" ? "End Time" : "Pick Up Time"}
					</label>
				</div>
			</div>
			<div className="grid md:grid-cols-1 md:gap-6">
				<div className="relative z-0 mb-6 w-full group">
					<textarea
						{...register("notes")}
						rows={1}
						name="notes"
						defaultValue={bookingDetail?.notes as string}
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
				className="mt-[25px] rounded-full bg-gradient-to-l from-[#A70D0E] to-[#EEB62B] hover:bg-gradient-to-r from-[#EEB62B] to-[#A70D0E] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
				Update
			</button>
		</form >
	)
}

export default EditBookingForm;