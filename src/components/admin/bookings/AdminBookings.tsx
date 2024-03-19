import { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";
import Link from "next/link"
import { formatTime } from "../../../utils/formatTime";
import usePagination from "../../../hooks/usePagination";
import Pagination from "@mui/material/Pagination";
import { BookingsArray, Booking } from "../../../types/router";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import Swal from "sweetalert2";
import { sendEmailToClientConfirmBooking } from "../../../lib/email";

const AdminBookings: React.FC = (): ReactJSXElement => {
	const [bookingsDataArray, setBookingsDataArray] = useState<[]>([]);
	const { data: bookingsData, refetch } = trpc.bookings.getAllBookings.useQuery();
	const handleConfirmBooking = trpc.bookings.confirmBooking.useMutation({
		onSuccess: async (data) => {
			console.log("data after confirming booking", data)
			if (!data) return;

			if (!data.startTime) return;
			await sendEmailToClientConfirmBooking(
				data.email,
				"tylermelnike@mnmk9.ca",
				data.petName,
				data.checkInDate,
				data.startTime,
				data.serviceName
			),
				refetch(),
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Booking Confirmed',
				})
		}
	});

	useEffect(() => {
		if (!bookingsData || Object.keys(bookingsData).length === 0) return;

		const newBookingsDataArray = [...bookingsData];
		setBookingsDataArray(newBookingsDataArray as []);
	}, [bookingsData])

	const handleCancelBooking = trpc.bookings.cancelBooking.useMutation({
		onSuccess: () => {
			refetch()
		}
	});

	// Pagination Logic
	const ITEMS_PER_PAGE = 6;
	const { currentPage, getCurrentData, changePage, pageCount } = usePagination(bookingsDataArray, ITEMS_PER_PAGE)
	const currentData = getCurrentData();

	const onPageChange = (event: any, value: number) => {
		changePage(value);
	}

	return (
		<div className="flex flex-col items-center">
			<ul className="w-full grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 md:gap-8 my-20">
				{currentData as BookingsArray && currentData?.length > 0 ? currentData?.map((booking: any) => (
					<li key={booking?.id} className="flex flex-col gap-4 rounded-xl bg-white/10 p-2 text-white hover:bg-white/20">
						<div className="flex justify-center">
							<div className="rounded-lg shadow-lg bg-white max-w-md w-full h-full min-h-[350px]">
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
									<p className="text-md text-gray-700 mb-2"><span className="font-bold">Check In:</span> {booking.checkInDate}</p>
									<p className="text-md text-gray-700 mb-2"><span className="font-bold">Check Out:</span> {booking.checkOutDate ? booking.checkOutDate : "--"}</p>
									<p className="text-md text-gray-700 mb-2"><span className="font-bold">Start Time:</span> {booking.startTime ? formatTime(booking.startTime) : "--"}</p>
									<p className="text-md text-gray-700 mb-2"><span className="font-bold">End Time:</span> {booking.endTime ? formatTime(booking.endTime) : "--"}</p>
									<p className="text-md text-gray-700 mb-2"><span className="font-bold">Notes:</span> {booking?.notes ? booking.notes : "--"}</p>
									<div className="flex flex-wrap justify-between md:justify-start lg:justify-between">

										{!booking.confirmedBooking && (
											<button
												className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 mr-4"
												onClick={() => handleConfirmBooking.mutate({ id: booking.id, confirmedBooking: booking.confirmedBooking })}
											>
												Confirm Booking
											</button>
										)}
										{booking.confirmedBooking && (
											<button
												className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
												onClick={() => handleCancelBooking.mutate({ id: booking.id })}
											>
												Cancel Booking
											</button>
										)}
										<Link className="block w-[160px] bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded mt-4" href={`/manage-booking/${booking.id}`}>
											Booking Details
										</Link>
									</div>
								</div>
							</div>
						</div>
					</li>
				)) : (
					<div className="container text-center">
						<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">No bookings yet....</h1>
					</div>
				)}
			</ul>
			{bookingsData && bookingsData.length > ITEMS_PER_PAGE &&
				<Pagination
					count={pageCount}
					size="large"
					page={currentPage}
					variant="outlined"
					color="secondary"
					shape="rounded"
					onChange={onPageChange}
				/>}
		</div>
	)
}

export default AdminBookings