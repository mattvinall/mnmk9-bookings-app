import React from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
import Image from 'next/image'
import logo from "../../../public/mnmk9-logo.jpg";

const MyImage = () => {
	return (
		<Image
			src={logo}
			alt="MNMK-9 Logo"
			className="rounded-full scale-50"
		/>
	)
}

const AuthShowcase: React.FC = () => {
	const { data: sessionData } = useSession();

	return (
		<div className="flex items-center">
			<p className="text-center text-small text-purple px-12">
				{sessionData && <span>{sessionData.user?.name}</span>}
			</p>
			<button
				className="rounded-full bg-gradient-to-b from-[#2e026d] to-[#15162c] px-10 py-3 font-semibold text-white no-underline transition hover:bg-gradient-to-b from-[#15162c] to-[#2e026d]"
				onClick={sessionData ? () => signOut() : () => signIn()}
			>
				{sessionData ? "Sign out" : "Sign in"}
			</button>
		</div>
	);
};

const Navbar = () => {
	return (
		<nav className="bg-white shadow-lg">
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex justify-between align-start">
					<div className="flex items-center space-x-24 h-32">
						<div>
							<a href="https://www.mnmk9.ca" className="flex items-center py-4 px-2">
								<MyImage />
							</a>
						</div>
						<div className="hidden md:flex items-center space-x-1">
							<a
								href=""
								className="py-4 px-4 text-purple-500 border-b-4 border-green-500 font-semibold ">Book a Service</a>
							<a
								href=""
								className="py-4 px-4 text-purple-500 font-semibold hover:text-green-500 transition duration-300">Manage A Service</a>
							<a
								href=""
								className="py-4 px-4 text-purple-500 font-semibold hover:text-green-500 transition duration-300">Contact Us</a>
						</div>
						<AuthShowcase />
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar;