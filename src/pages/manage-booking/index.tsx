"use-client";

import { useEffect } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Link from "next/link";

const ManageBooking = () => {
	const router = useRouter();
	console.log("router", router);
	// get email from session data
	const { data: sessionData } = useSession();
	const id = sessionData?.user?.id as string;

	// query user table by email to get user data
	const { data, isLoading, error, refetch } = trpc.user.byId.useQuery({ id })

	useEffect(() => {
		console.log("run after changing routes")
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
		<>
			{
				sessionData ? (
					<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
						<h1 className="text-5xl font-extrabold tracking-tight text-center text-white sm:text-[5rem]">
							Manage a  <span className="text-[hsl(280,100%,70%)]">Booking</span>
						</h1>
						{data?.bookings && data?.bookings.length > 1 ? <h2 className="text-3xl font-bold text-white text-center">To manage a service, click the actions. Clicking on the box will take you to the detail page.</h2> : null}
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2 md:gap-8 my-20">
							{
								data?.bookings.length ? (
									data?.bookings?.map(booking => {
										return (
											<Link
												className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
												href={`/manage-booking/${booking.id}`}
												key={booking.id}
											>
												<div className="flex justify-center">
													<div className="rounded-lg shadow-lg bg-white max-w-md">
														<div className="p-6">
															<h2 className="text-gray-900 text-2xl font-medium mb-2">{booking.serviceName}</h2>
															<p className="text-gray-900 text-xl font-medium mb-2">{booking.petName}</p>
															<p className="text-gray-700 text-base mb-4">
																confirmation ID: <br />{booking.id}
															</p>
															<p className="text-gray-600 font-bold text-xs flex">
																{booking.checkInDate} {booking.checkOutDate ? `→ ${booking.checkOutDate}` : null}
																{booking.startTime ? (<span className="ml-5 text-gray-600 font-bold text-xs">{booking.startTime}</span>) : null}
																{booking.endTime ? (<span className="text-gray-600 font-bold text-xs">-{booking.endTime}</span>) : null}
															</p>
														</div>
													</div>
												</div>
											</Link>
										)
									})
								) : (
									<div className="container text-center">
										<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">No bookings yet....</h1>
									</div>
								)
							}
						</div>
					</div>
				) : (
					<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
						<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Please Login to manage a booking.</h1>
					</div>
				)
			}
		</>
	)
}

export default ManageBooking