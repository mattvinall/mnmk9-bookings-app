"use client";

import { useEffect } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import AdminBookings from '../../components/admin/bookings/AdminBookings';
import ClientBookings from '../../components/client/bookings/ClientBookings';
import { useAuth, useUser } from '@clerk/nextjs';
import { getUserById } from '../../api/users';

const ManageBooking = () => {
	const router = useRouter();

	const { isSignedIn } = useUser();
	const { userId } = useAuth();

	// query user table by email to get user data
	const { data: userData, isLoading, error, refetch } = getUserById(userId as string);

	useEffect(() => {
		// wait 1 second for page to load and refetch 
		// handles edge case when user edits their booking and routes back - want most up to date data
		setTimeout(() => {
			refetch();
		}, 1000)
	}, [router.pathname])

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
		<section>
			{
				isSignedIn ? (
					<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
						<h1 className="text-5xl font-extrabold tracking-tight text-center text-white sm:text-[5rem]">
							Manage a  <span className="text-[rgb(103,163,161)]">Booking</span>
						</h1>
						{userData?.role === "user" ? (
							<ClientBookings />
						) : (
							// admin view logic
							<>
								<AdminBookings />
							</>
						)}
					</div>
				) : (
					<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
						<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Please Login to manage a booking.</h1>
					</div>
				)
			}
		</section>
	)
}

export default ManageBooking