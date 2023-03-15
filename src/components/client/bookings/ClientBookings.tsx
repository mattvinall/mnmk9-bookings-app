import Link from "next/link";
import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import { formatTime } from "../../../lib/formatTime";

const ClientBookings = () => {
	const { data: sessionData } = useSession();
	const id = sessionData?.user?.id as string;

	// query user table by email to get user data
	const { data: userData, isLoading, error } = trpc.user.byId.useQuery({ id });

	if (isLoading) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Loading....</h1>
		</div>
	);

	if (error) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Error....please contact support</h1>
		</div>
	);

	return (
		<ul className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 md:gap-8 my-20">
			{userData?.bookings && userData?.bookings?.length > 0 ? userData?.bookings?.map(booking => {
				return (
					<li key={booking?.id} className="w-full flex flex-col gap-4 rounded-xl bg-white/10 p-2 text-white hover:bg-white/20">
						<div className="flex justify-center">
							<div className="w-full rounded-lg shadow-lg bg-white max-w-md w-full h-full min-h-[320px]">
								<div className="p-6">
									<span className="inline-block text-xl font-bold uppercase text-gray-900 mb-2">{booking.serviceName} | </span><span className="inline-block text-xl font-bold uppercase text-gray-900 mb-2"> &nbsp;{booking.petName}</span>
									<p className="text-md text-gray-700 mb-2"><span className="font-bold">Confirmed:</span> {booking.confirmedBooking ? "✅" : "❌"}</p>
									<p className="text-md text-gray-700 mb-2"><span className="font-bold">Check In:</span> {booking.checkInDate}</p>
									<p className="text-md text-gray-700 mb-2"><span className="font-bold">Check Out:</span> {booking.checkOutDate ? booking.checkOutDate : "--"}</p>
									<p className="text-md text-gray-700 mb-2"><span className="font-bold">Start Time:</span> {booking.startTime ? formatTime(booking.startTime) : "--"}</p>
									<p className="text-md text-gray-700 mb-2"><span className="font-bold">End Time:</span> {booking.endTime ? formatTime(booking.endTime) : "--"}</p>
									<p className="text-md text-gray-700 mb-2"><span className="font-bold">Notes:</span> {booking?.notes ? booking.notes : "--"}</p>
									<div className="flex flex-wrap justify-between md:justify-start lg:justify-between">
										<Link className="block w-[160px] bg-purple-900 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4" href={`/manage-booking/${booking.id}`}>
											Booking Details
										</Link>
									</div>
								</div>
							</div>
						</div>
					</li>
				)
			}) : (
				<div className="container text-center">
					<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">No bookings yet....</h1>
				</div>
			)}
		</ul>
	)
}

export default ClientBookings;