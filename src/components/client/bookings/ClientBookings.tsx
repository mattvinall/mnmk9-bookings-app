import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { formatTime } from "../../../utils/formatTime";
import usePagination from "../../../hooks/usePagination";
import Pagination from "@mui/material/Pagination";
import { Bookings } from "@prisma/client";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useAuth } from "@clerk/nextjs";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const ClientBookings = (): ReactJSXElement => {

	const { userId } = useAuth();

	// query user table by email to get user data
	const { data: userData, isLoading, error } = trpc.user.byId.useQuery({ id: userId as string });

	// Pagination Logic
	const ITEMS_PER_PAGE = 3;
	const { currentPage, getCurrentData, changePage, pageCount } = usePagination(userData?.bookings as Bookings[], ITEMS_PER_PAGE)
	const currentBookingsData = getCurrentData() as Bookings[];

	const onPageChange = (event: any, value: number) => {
		changePage(value);
	}

	if (isLoading) return (
		<LoadingSpinner />
	);

	if (error) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Error....please contact support</h1>
		</div>
	);

	return (
		<div className="flex flex-col items-center">
			<ul className="flex grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 md:gap-8 my-20">
				{currentBookingsData && currentBookingsData?.length > 0 ? currentBookingsData?.map((booking: Bookings) => {
					return (
						<li key={booking?.id} className="flex w-[350px] justify-center flex-col gap-4 rounded-xl bg-white/10 p-2 text-white hover:bg-white/20">
							<div className="flex justify-center">
								<div className="rounded-lg shadow-lg bg-white max-w-md w-full h-full min-h-[350px]">
									<div className="p-6">
										<span className="inline-block text-xl font-bold uppercase text-gray-900 mb-2">{booking.serviceName} | </span><span className="inline-block text-xl font-bold uppercase text-gray-900 mb-2"> &nbsp;{booking.petName}</span>
										<p className="text-md text-gray-700 mb-2"><span className="font-bold">Confirmed:</span> {booking.confirmedBooking ? "✅" : "❌"}</p>
										<p className="text-md text-gray-700 mb-2"><span className="font-bold">Check In:</span> {booking.checkInDate}</p>
										<p className="text-md text-gray-700 mb-2"><span className="font-bold">Check Out:</span> {booking.checkOutDate ? booking.checkOutDate : "--"}</p>
										<p className="text-md text-gray-700 mb-2"><span className="font-bold">Start Time:</span> {booking.startTime ? formatTime(booking.startTime) : "--"}</p>
										<p className="text-md text-gray-700 mb-2"><span className="font-bold">End Time:</span> {booking.endTime ? formatTime(booking.endTime) : "--"}</p>
										<p className="text-md text-gray-700 mb-2"><span className="font-bold">Notes:</span> {booking?.notes ? booking.notes : "--"}</p>
										<div className="flex flex-wrap justify-between md:justify-start lg:justify-between">
											<Link className="block w-[160px] bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-4" href={`/manage-booking/${booking.id}`}>
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
			{userData?.bookings && userData?.bookings.length > ITEMS_PER_PAGE && <Pagination
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

export default ClientBookings;