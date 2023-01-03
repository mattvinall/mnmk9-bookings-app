import React from 'react'
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { trpc } from "../utils/trpc";

const HomeShowCase = () => {
	const { data: sessionData } = useSession();
	const id = sessionData?.user?.id;
	return (
		<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
				MNMK-9 <span className="text-[hsl(280,100%,70%)]">Bookings</span>
			</h1>
			<h2 className="text-2xl font-bold tracking-tight text-white text-center sm:text-[3rem] my-8">Your One Stop Shop to Schedule and Manage Your Bookings.</h2>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
				<Link
					className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
					href={`/profile/${id}`}
				>
					<h3 className="text-2xl font-bold">Manage Profile →</h3>
					<p className="text-lg">
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
			</div>
		</div >
	)
}

export default HomeShowCase