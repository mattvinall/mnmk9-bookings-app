"use-client";

import { useState, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CheckInTable from "../../components/admin/tables/checkInTable";
import CheckOutTable from "../../components/admin/tables/checkOutTable";
import { useSession } from "next-auth/react";
import { formatTime } from "../../lib/formatTime";

const Bookings = () => {
	// get user session
	const { data: sessionData } = useSession();
	// get the id from the user session
	const id = sessionData?.user?.id as string;
	// fetch user by id 
	const { data: userData } = trpc.user.byId.useQuery({ id });

	// fetch bookings if user role is admin
	const { data: bookingsData, isLoading, error } = trpc.bookings.getAllBookings.useQuery();
	console.log("booking data", bookingsData);

	const [date, setDate] = useState(new Date());
	const [checkInBookings, setCheckInBookings] = useState([]);
	const [checkOutBookings, setCheckOutBookings] = useState([])

	const handleDateChange = (date: any) => {
		console.log("date", date.toISOString().split("T")[0]);
		setDate(date);
	};

	const checkInBookingsList = checkInBookings?.map((booking: any, idx: number) => {
		return (
			<tr
				key={booking?.id}
				className={`${idx % 2 === 0 ? "border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700" : "bg-white border-b dark:bg-gray-900 dark:border-gray-700"} `}>
				<td className="text-white px-6 py-4">{booking?.firstName} {booking?.lastName}</td>
				<td className="text-white px-6 py-4">{booking?.serviceName}</td>
				<td className="text-white px-6 py-4">{booking?.checkInDate ?? "--"}</td>
				<td className="text-white px-6 py-4">{booking?.checkOutDate ?? "--"}</td>
				<td className="text-white px-6 py-4">{booking?.startTime ? formatTime(booking?.startTime) : "--"}</td>
				<td className="text-white px-6 py-4">{booking?.endTime ? formatTime(booking?.endTime) : "--"}</td>
				{/* <td><button>Add to Google Calendar</button></td> */}
			</tr>
		);
	});

	const checkOutBookingsList = checkOutBookings?.map((booking: any, idx: number) => {
		return (
			<tr
				key={booking?.id}
				className={`${idx % 2 === 0 ? "border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700" : "bg-white border-b dark:bg-gray-900 dark:border-gray-700"} `}>
				<td className="text-white px-6 py-4">{booking?.firstName} {booking?.lastName}</td>
				<td className="text-white px-6 py-4">{booking?.serviceName}</td>
				<td className="text-white px-6 py-4">{booking?.checkInDate ?? "--"}</td>
				<td className="text-white px-6 py-4">{booking?.checkOutDate ?? "--"}</td>
				<td className="text-white px-6 py-4">{booking?.startTime ? formatTime(booking?.startTime) : "--"}</td>
				<td className="text-white px-6 py-4">{booking?.endTime ? formatTime(booking?.endTime) : "--"}</td>
				{/* <td><button>Add to Google Calendar</button></td> */}
			</tr>
		);
	});

	useEffect(() => {
		const filteredCheckInBookings = bookingsData?.filter(booking => {
			const checkInDate = new Date(booking?.checkInDate as string).toISOString();

			const checkInBookings = new Date(checkInDate)
				.toISOString()
				.split("T")[0] === date.toISOString().split("T")[0];

			return checkInBookings;
		});

		const filteredCheckOutBookings = bookingsData?.filter(booking => {
			const checkOutDate = new Date(booking?.checkOutDate as string).toISOString();
			const checkOutBookings = new Date(checkOutDate)
				.toISOString()
				.split("T")[0] === date.toISOString().split("T")[0];

			return checkOutBookings;
		})

		console.log("filteredBookings", filteredCheckInBookings);
		if (!filteredCheckInBookings) {
			setCheckInBookings([])
		}

		if (!filteredCheckOutBookings) {
			setCheckOutBookings([])
		}

		setCheckInBookings(filteredCheckInBookings as []);
		setCheckOutBookings(filteredCheckOutBookings as []);

	}, [date]);

	if (!sessionData) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Please Login....</h1>
		</div>
	)

	if (isLoading) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Loading....</h1>
		</div>
	);

	if (error) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Error....please contact support</h1>
		</div>
	)

	return (
		<>
			{userData?.role === "admin" && sessionData ? (
				<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
						MNMK-9  <span className="text-[hsl(280,100%,70%)]">Bookings</span>
					</h1>
					<h2 className="text-3xl font-bold text-white text-center">Select a date on the Calendar to see your bookings.</h2>
					<div className="mt-5">
						<Calendar value={date} onChange={handleDateChange} />
					</div>
					<div className="mt-5 relative">
						{/* Check In Table */}
						{checkInBookings && <CheckInTable checkInBookings={checkInBookings} checkInBookingsList={checkInBookingsList} />}
						{/* Check Out Table */}
						{checkOutBookings && <CheckOutTable checkOutBookings={checkOutBookings} checkOutBookingsList={checkOutBookingsList} />}
					</div>

				</div>
			) : (
				<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Error 403: Forbidden</h1>
				</div>
			)}
		</>
	)
}

export default Bookings;