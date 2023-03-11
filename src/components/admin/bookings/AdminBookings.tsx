import { trpc } from "../../../utils/trpc";
import Link from "next/link"

const AdminBookings = () => {
	const { data: bookingsData, refetch } = trpc.bookings.getAllBookings.useQuery();
	const handleConfirmBooking = trpc.bookings.confirmBooking.useMutation({
		onSuccess: () => {
			refetch()
		}
	});

	const handleCancelBooking = trpc.bookings.cancelBooking.useMutation({
		onSuccess: () => {
			refetch()
		}
	})

	return (
		<li className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2 md:gap-8 my-20">
			<>
				{bookingsData && bookingsData?.length > 0 ? bookingsData?.map((booking, idx) => (
					<div key={booking?.id} className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-2 text-white hover:bg-white/20">
						<div className="flex justify-center">
							<div className="rounded-lg shadow-lg bg-white max-w-md w-full h-full min-h-[320px]">
								<div className="bg-gray shadow-lg  overflow-hidden w-full max-w-md">
									<div className="bg-gray-700 px-4 py-2">
										<h2 className="text-lg font-bold">{booking.firstName} {booking.lastName}</h2>
										<a href={`mailto:${booking.email}`} className="text-sm mb-2 hover:underline">{booking.email}</a>
									</div>
								</div>
								<div className="p-6">

									<a href={`tel:${booking.phoneNumber}`} className="text-sm hover:underline text-gray-500 mb-2"><span className="font-bold inline-block mb-2">Phone:</span> {booking.phoneNumber}</a>
									<p className="text-sm text-gray-500 mb-2"><span className="font-bold">Confirmed:</span> {booking.confirmedBooking ? "Yes" : "No"}</p>
									<p className="text-sm text-gray-500 mb-2"><span className="font-bold">Check In:</span> {booking.checkInDate} <span className="font-bold">Check Out:</span> {booking.checkOutDate}</p>
									<p className="text-sm text-gray-500 mb-2"><span className="font-bold">Start Time:</span> {booking.startTime} <span className="font-bold">End Time:</span> {booking.endTime}</p>
									<p className="text-sm text-gray-500 mb-2"><span className="font-bold">Notes:</span> {booking?.notes}</p>
									<p className="text-sm text-gray-500 mb-2"><span className="font-bold">Pet Name:</span> {booking.petName}</p>
									<p className="text-sm text-gray-500 mb-2"><span className="font-bold">Service:</span> {booking.serviceName}</p>
									{!booking.confirmedBooking && (
										<button
											className="bg-purple-900 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4"
											onClick={() => handleConfirmBooking.mutate({ id: booking.id, confirmedBooking: booking.confirmedBooking })}
										>
											Confirm Booking
										</button>
									)}
									{booking.confirmedBooking && (
										<button
											className="bg-purple-900 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4"
											onClick={() => handleCancelBooking.mutate({ id: booking.id })}
										>
											Cancel Booking
										</button>
									)}
									<Link className="block w-[160px] bg-purple-900 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4" href={`/manage-booking/${booking.id}`}>
										Booking Details
									</Link>
								</div>
							</div>
						</div>
					</div>
				)) : (
					<div className="container text-center">
						<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">No bookings yet....</h1>
					</div>
				)}
			</>
		</li>
	)
}

export default AdminBookings