"use client";

import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CheckInTable from "../../../components/admin/tables/checkInTable";
import CheckOutTable from "../../../components/admin/tables/checkOutTable";
import { formatTime } from "../../../utils/formatTime";
import { Bookings } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";
import { getUserById } from "../../../api/users";
import { getAllBookings } from "../../../api/bookings";

const BookingsCalendar = () => {
	const { userId, isSignedIn } = useAuth();

	const { data: userData } = getUserById(userId as string);

	// fetch bookings if user role is admin
	const { data: bookingsData, isLoading, error } = getAllBookings();

	const filteredBookingsByConfirmedStatus = bookingsData?.filter((booking: Bookings) => booking.confirmedBooking === true);
	console.log("filtered bookings by confirmed status", filteredBookingsByConfirmedStatus);

	const [date, setDate] = useState(new Date());
	const [checkInBookings, setCheckInBookings] = useState([]);
	const [checkOutBookings, setCheckOutBookings] = useState([])

	const handleDateChange = (date: Date) => {
		console.log("date", date.toISOString().split("T")[0]);
		setDate(date);
	};

	const checkInBookingsList = checkInBookings?.map((booking: Bookings, idx: number) => {
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
			</tr>
		);
	});

	const checkOutBookingsList = checkOutBookings?.map((booking: Bookings, idx: number) => {
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
			</tr>
		);
	});

	useEffect(() => {
		const filteredCheckInBookings = filteredBookingsByConfirmedStatus?.filter((booking: Bookings) => {
			const checkInDate = new Date(booking?.checkInDate as string).toISOString();

			const checkInBookings = new Date(checkInDate)
				.toISOString()
				.split("T")[0] === date.toISOString().split("T")[0];

			return checkInBookings;
		});

		const filteredCheckOutBookings = filteredBookingsByConfirmedStatus?.filter((booking: Bookings) => {
			const checkOutDate = new Date(booking?.checkOutDate as string).toISOString();
			const checkOutBookings = new Date(checkOutDate)
				.toISOString()
				.split("T")[0] === date.toISOString().split("T")[0];

			return checkOutBookings;
		})

		console.log("filteredBookings", filteredCheckInBookings);
		if (!filteredCheckInBookings) {
			setCheckInBookings([]);
		}

		if (!filteredCheckOutBookings) {
			setCheckOutBookings([]);
		}

		setCheckInBookings(filteredCheckInBookings as []);
		setCheckOutBookings(filteredCheckOutBookings as []);

	}, [date]);

	if (!isSignedIn) return (
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
	);

	return (
		<>
			{userData?.role === "admin" && isSignedIn ? (
				<div className="container flex flex-col items-center lg:flex-row lg:items-center justify-between gap-12 px-4 py-16">
					<Calendar className="!lg:w-full" value={date} onChange={handleDateChange} />
					<div className="mt-5 relative">
						{/* Check In Table */}
						{(!checkInBookings || checkInBookings?.length === 0) && (!checkOutBookings || checkOutBookings.length === 0) ? <p className="text-[1.2rem] text-gray-100 text-left">Please click on a date to see your bookings</p> : null}
						{checkInBookings && checkInBookings?.length > 0 && <CheckInTable checkInBookings={checkInBookings} checkInBookingsList={checkInBookingsList} />}
						{/* Check Out Table */}
						{checkOutBookings && checkOutBookings?.length > 0 && <CheckOutTable checkOutBookings={checkOutBookings} checkOutBookingsList={checkOutBookingsList} />}
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

export default BookingsCalendar;