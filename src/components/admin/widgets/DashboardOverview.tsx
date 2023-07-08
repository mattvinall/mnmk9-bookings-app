import { getAllBookings } from "../../../api/bookings";
import { trpc } from "../../../utils/trpc";
import { Bookings } from "@prisma/client";

const DashboardOverview = () => {
	// fetch bookings if user role is admin
	const { data: bookingsData, isLoading, error } = getAllBookings();

	console.log("bookings data calling getAllBookings", bookingsData);

	const filteredCheckInBookings = bookingsData?.filter((booking: Bookings) => {
		const checkInDate = new Date(booking?.checkInDate as string).toISOString();
		const today = new Date().toISOString().split("T")[0];
		const checkInBookings = new Date(checkInDate)
			.toISOString()
			.split("T")[0] === today && booking.confirmedBooking === true;

		return checkInBookings;
	});

	console.log("check in bookings", filteredCheckInBookings);

	const filteredCheckOutBookings = bookingsData?.filter((booking: Bookings) => {
		const checkOutDate = new Date(booking?.checkOutDate as string).toISOString();
		const today = new Date().toISOString().split("T")[0];
		const checkOutBookings = new Date(checkOutDate)
			.toISOString()
			.split("T")[0] === today && booking.confirmedBooking === true;

		return checkOutBookings;
	});

	const totalServicesToday = filteredCheckInBookings?.length;
	const totalCheckInBoarding = filteredCheckInBookings?.filter((booking: Bookings) => booking.serviceName === "Boarding").length;
	const totalCheckOutBoarding = filteredCheckOutBookings?.filter((booking: Bookings) => booking.serviceName === "Boading").length;
	const totalTraining = filteredCheckInBookings?.filter((booking: Bookings) => booking.serviceName === "Training").length;
	const totalGrooming = filteredCheckInBookings?.filter((booking: Bookings) => booking.serviceName === "Grooming").length;
	const totalDaycare = filteredCheckInBookings?.filter((booking: Bookings) => booking.serviceName === "Daycare").length;

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
		<>
			<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-4">
				<div className="bg-gray-100 p-8 text-center">
					<p className="text-gray-900 font-medium text-xl mb-2">Check Ins Total (Boarding, Grooming, Training, Daycare)</p>
					<h2 className="text-2xl font-bold text-gray-800">{totalServicesToday}</h2>
				</div>
				<div className="bg-gray-100 p-8 text-center">
					<p className="text-gray-900 font-medium text-xl mb-2">Check Ins (Boarding)</p>
					<h2 className="text-2xl font-bold text-gray-800">{totalCheckInBoarding}</h2>
				</div>
				<div className="bg-gray-100 p-8 text-center">
					<p className="text-gray-900 font-medium text-xl mb-2">Check Outs (Boarding)</p>
					<h2 className="text-2xl font-bold text-gray-800">{totalCheckOutBoarding}</h2>
				</div>
				<div className="bg-gray-100 p-8 text-center">
					<p className="text-gray-900 font-medium text-xl mb-2">Training</p>
					<h2 className="text-2xl font-bold text-gray-800">{totalTraining}</h2>
				</div>
				<div className="bg-gray-100 p-8 text-center">
					<p className="text-gray-900 font-medium text-xl mb-2">Daycare</p>
					<h2 className="text-2xl font-bold text-gray-800">{totalDaycare}</h2>
				</div>
				<div className="bg-gray-100 p-8 text-center">
					<p className="text-gray-900 font-medium text-xl mb-2">Grooming</p>
					<h2 className="text-2xl font-bold text-gray-800">{totalGrooming}</h2>
				</div>
			</section>
		</>
	)
}

export default DashboardOverview;