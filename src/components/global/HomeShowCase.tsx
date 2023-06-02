import React from 'react'
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { useAuth } from '@clerk/nextjs';

const HomeShowCase = () => {
	const { userId, sessionId } = useAuth();

	const { data: userData } = trpc.user.byId.useQuery({ id: userId as string });

	const ClientShowCase = () => {
		return (
			<>
				<Link
					className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
					href={`/profile/${userData?.id as string}`}
				>
					<h3 className="text-2xl font-bold">Manage Profile →</h3>
					<p className="text-lg text">
						Before booking a service, add your pet to your profile!
					</p>
				</Link>
				<Link
					className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
					href="/create-booking"
				>
					<h3 className="text-2xl font-bold">Create Booking →</h3>
					<p className="text-lg">
						Book a service with Tyler
					</p>
				</Link>
				<Link
					className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
					href="/manage-booking"
				>
					<h3 className="text-2xl font-bold">Manage a Booking →</h3>
					<p className="text-lg">
						need to change your booking date or cancel?
					</p>
				</Link>
			</>
		)
	}
	const AdminShowCase = () => {
		return (
			<>
				<Link
					className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
					href={`/dashboard`}
				>
					<h3 className="text-2xl font-bold">Dashboard →</h3>
					<p className="text-lg text">
						Daily metrics, calendar view, manage daily tasks and easily confirm your bookings!
					</p>
				</Link>
				<Link
					className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
					href="/users"
				>
					<h3 className="text-2xl font-bold">Manage Users →</h3>
					<p className="text-lg">
						Search and view user profiles quickly.
					</p>
				</Link>
				<Link
					className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
					href="/manage-booking"
				>
					<h3 className="text-2xl font-bold">Manage a Booking →</h3>
					<p className="text-lg">
						need to update or cancel a clients&lsquo; booking?
					</p>
				</Link>
			</>
		)
	}

	return (
		<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
			<h1 className="text-5xl text-center font-extrabold tracking-tight text-white sm:text-[5rem]">
				MNMK-9 <span className="text-[rgb(103,163,161)]">Bookings</span>
			</h1>
			<h2 className="text-12xl font-bold tracking-tight text-white text-center text-[2rem] sm:text-[3rem] my-8">Your One Stop Shop to Schedule and Manage Your Bookings.</h2>
			{sessionId ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
					{userData?.role === "user" ? (
						<ClientShowCase />
					) : (
						<AdminShowCase />
					)
					}
				</div >
			) : (
				<p className="text-5xl font-extrabold tracking-tight text-white text-[2rem] md:text-[3rem]">Please Login</p>
			)}
		</div >
	)
}

export default HomeShowCase