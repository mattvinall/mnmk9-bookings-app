"use client";

import { useEffect, useState } from "react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Media from "react-media";
import { formatTime } from '../../../utils/formatTime';

type Props = {
	checkInBookings: any
	checkInBookingsList: any
}

const CheckInTable = ({ checkInBookings, checkInBookingsList }: Props): ReactJSXElement => {
	const [showArrows, setShowArrows] = useState<boolean>(true);

	useEffect(() => {
		if (checkInBookings && checkInBookings.length > 1) {
			setShowArrows(true);
			return;
		}

		setShowArrows(false);
	}, [showArrows, checkInBookings?.length]);

	return (
		<>
			<h3 className="text-white text-center md:text-left font-bold text-[2rem] mb-8">Checking In:</h3>
			<Media query={{ minWidth: 900 }}>
				{matches => matches ? (

					<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className={`text-md text-gray-700 uppercase bg-white dark:bg-white dark:text-navy-800`}>
							<tr>
								<th scope="col" className="px-6 py-3">
									Name
								</th>
								<th scope="col" className="px-6 py-3">
									Service
								</th>
								<th scope="col" className="px-6 py-3">
									Date (Check In/Start)
								</th>
								<th scope="col" className="px-6 py-3">
									Date (Check Out/End)
								</th>
								<th scope="col" className="px-6 py-3">
									Time (Start)
								</th>
								<th scope="col" className="px-6 py-3">
									Time (End)
								</th>
							</tr>
						</thead>
						<tbody>
							{checkInBookings && checkInBookings.length > 0 ? checkInBookingsList : <p className="text-white text-[1.2rem] overflow-none mt-4">Nobody checking in this date.</p>}
						</tbody>
					</table>
				) : (
					<Splide aria-label="MNMK-9 Bookings that have not confirmed" options={{ arrows: showArrows === true ? true : false }}>
						{checkInBookings && checkInBookings?.map((booking: any) => {
							const formattedCheckInDate = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							}) : '';
							const formattedCheckOutDate = booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							}) : '';
							return (
								<SplideSlide key={booking?.id}>
									<div className="flex flex-col w-full sm:w-[400px] gap-4 rounded-xl p-2 text-white ">
										<div className="flex justify-center">
											<div className="rounded-lg shadow-lg bg-white max-w-md w-full h-full min-h-[320px]">
												<div className="bg-gray shadow-lg  overflow-hidden w-full max-w-md">
													<div className="bg-gray-700 px-4 py-2">
														<h2 className="uppercase text-lg font-bold">{booking.firstName} {booking.lastName}</h2>
														<a href={`mailto:${booking.email}`} className="inline-blocktext-sm mb-2 hover:underline">{booking.email}</a>
														<a href={`tel:${booking.phoneNumber}`} className="block text-sm mb-2 hover:underline">{booking.phoneNumber}</a>
													</div>
												</div>
												<div className="p-6">
													<span className="inline-block text-xl font-bold uppercase text-gray-900 mb-2">{booking.serviceName} | </span><span className="inline-block text-xl font-bold uppercase text-gray-900 mb-2"> &nbsp;{booking.petName}</span>
													<p className="text-md text-gray-700 mb-2"><span className="font-bold">Confirmed:</span> {booking.confirmedBooking ? "✅" : "❌"}</p>
													<p className="text-md text-gray-700 mb-2"><span className="font-bold">Check In Date:</span> {formattedCheckInDate}</p>
													{booking.serviceName === "Boarding" ? <p className="text-md text-gray-700 mb-2"><span className="font-bold">Check Out Date:</span> {booking.checkOutDate ? formattedCheckOutDate : "--"}</p> : null}
													<p className="text-md text-gray-700 mb-2"><span className="font-bold">
														{booking.serviceName === "Training" ? "Start Time:" : "Drop Off Time"}</span> {booking.startTime ? formatTime(booking.startTime) : "--"}
													</p>
													<p className="text-md text-gray-700 mb-2"><span className="font-bold">
														{booking.serviceName === "Training" ? "End Time:" : "Pick Up Time"}</span> {booking.endTime ? formatTime(booking.endTime) : "--"}
													</p>
													<p className="text-md text-gray-700 mb-2"><span className="font-bold">Notes:</span> {booking?.notes ? booking.notes : "--"}</p>
												</div>
											</div>
										</div>
									</div>
								</SplideSlide>
							)
						})}
					</Splide>
				)}
			</Media>
		</>
	)
}

export default CheckInTable;