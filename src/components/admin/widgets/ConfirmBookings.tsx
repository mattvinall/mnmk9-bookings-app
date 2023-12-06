import { useEffect, useState } from "react";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Link from "next/link";
import { Booking } from "../../../types/router";
import { formatTime } from "../../../utils/formatTime";
import { getAllBookings } from "../../../api/bookings";
import { formatDate } from "../../../utils/formatDate";
import { trpc } from "../../../utils/trpc";

const ConfirmBookings = () => {
	const { data: bookingsData, refetch } = getAllBookings();

	const filteredBookingsByNotConfirmed = bookingsData?.filter((booking: Booking) => booking.confirmedBooking === false);

	const [showArrows, setShowArrows] = useState<boolean>(true);

	useEffect(() => {
		if (filteredBookingsByNotConfirmed && filteredBookingsByNotConfirmed.length > 1) {
			setShowArrows(true);
			return;
		}

		setShowArrows(false);
	}, [showArrows, filteredBookingsByNotConfirmed?.length]);

	const { mutate: confirmBooking } = trpc.bookings.confirmBooking.useMutation({
		onSuccess: () => {
			refetch();
		},
	});

	return (
		<div className="w-full md:w-[50%] flex flex-col pl-0 lg:pl-24">
			{filteredBookingsByNotConfirmed && filteredBookingsByNotConfirmed?.length > 0 ? <h2 className="text-left mt-16 lg:mt-0 lg:text-center text-3xl font-bold mb-8 text-white">Confirm Bookings:</h2> : null}
			<Splide aria-label="MNMK-9 Bookings that have not confirmed" options={{ arrows: showArrows === true ? true : false }}>
				{filteredBookingsByNotConfirmed && filteredBookingsByNotConfirmed.length > 0 ? filteredBookingsByNotConfirmed?.map((booking: Booking) => {
					const formattedCheckInDate = formatDate(booking.checkInDate);
					const formattedCheckOutDate = formatDate(booking.checkOutDate);

					return (
						<SplideSlide key={booking?.id}>
							<li className="flex flex-col gap-4 rounded-xl  p-2 text-white ">
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
											<div className="flex flex-col flex-wrap justify-between md:justify-start lg:justify-between">
												{!booking.confirmedBooking && (
													<button
														className="text-center bg-green-700 hover:bg-green-600 text-white w-[175px] font-bold py-2 px-4 rounded mt-4"
														onClick={() => confirmBooking({ id: booking.id, confirmedBooking: !booking.confirmedBooking })}
													>
														Confirm Booking
													</button>
												)}
												<Link className="block w-[175px] text-center  bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-4" href={`/manage-booking/${booking.id}`}>
													Booking Details
												</Link>
											</div>
										</div>
									</div>
								</div>
							</li>
						</SplideSlide>
					)
				}) : (
					<div className="container text-center lg:text-right mt-16 lg:mt-0">
						<h3 className="text-1xl font-extrabold tracking-tight text-white sm:text-[1.5rem]">All Bookings Confirmed ✅</h3>
					</div>
				)}
			</Splide>
		</div>
	)
}

export default ConfirmBookings;