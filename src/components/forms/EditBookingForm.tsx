"use-client";
import { FC } from 'react';

const EditBookingForm: FC = ({ register, handleSubmit, onSubmit, isSubmitting, bookingDetail }) => {
	return (
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
	)
}

export default EditBookingForm;