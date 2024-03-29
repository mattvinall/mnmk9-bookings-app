"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";
import Image from 'next/image';
import Link from 'next/link';
import logo from "../../../public/mnmk9-logo.jpg";
import { getUserById } from "../../api/users";
import { LoadingSpinnerDark } from "../client/ui/LoadingSpinner";

const Logo = () => {
	return (
		<Image
			src={logo}
			alt="MNMK-9 Logo"
			className="rounded-full scale-50 w-[100px] h-[100px] md:w-[200px] md:h-[200px]"
		/>
	)
}

type Props = {
	userData: any,
	isSignedIn: boolean
}


const AuthShowcase = ({ userData, isSignedIn }: Props) => {
	const router = useRouter();
	useEffect(() => {
		if (isSignedIn && userData?.length > 0) {
			router.reload();
		}
	}, [isSignedIn, userData])

	return (
		<div className="flex items-center justify-center">
			{isSignedIn ? (
				<>
					<div className="rounded-full bg-gradient-to-b from-[#A70D0E] to-[#EEB62B] hover:bg-gradient-to-t from-[#EEB62B] to-[#A70D0E] px-10 py-3 font-semibold text-white hover:underline transition">
						<SignOutButton />
					</div>
					<Link aria-label="Click to go to user profile detail page" href={`/profile/${userData?.id}`}>
						{
							userData?.image ? (
								<Image className="w-[100px] h-[100px] rounded-full scale-50 float-right" src={userData?.image as string} alt={`profile image of ${userData?.name}`} />
							) : (
								<LoadingSpinnerDark />
							)
						}
					</Link>
				</>
			) : (
				<div className="rounded-full bg-gradient-to-b from-[#A70D0E] to-[#EEB62B]from-[#A70D0E] to-[#EEB62B] hov:bg-gradient-to-t from-[#EEB62B] to-[#A70D0E] px-10 py-3 font-semibold text-white hover:underline transition">
					<SignInButton />
				</div>
			)}

		</div>
	);
}


const Navbar: React.FC = () => {
	const { userId, isSignedIn } = useAuth();

	const { data: userData } = getUserById(userId as string);
	console.log("userData", userData);

	const [menuToggled, setMenuToggled] = useState(false);
	const handleClick = () => {
		setMenuToggled((prevState) => !prevState);
	}

	const ClientViewNavigation = () => {
		return (
			<nav className="bg-white shadow-lg" role="navigation" aria-label="navigation">
				<div className={`${!menuToggled ? 'transition-ease max-w-7xl mx-auto px-4' : 'px-0'}`}>
					<div className="flex justify-between align-start h-32">
						<Link href="https://www.mnmk9.ca" className="flex items-center md:py-4 md:px-2">
							<Logo />
						</Link>
						<div className={`flex items-center`}>
							<div className="hidden md:flex items-center">
								<Link
									href="/"
									className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold ">
									Home
								</Link>
								{isSignedIn ? (
									<>
										<Link
											href={`/profile/${userData?.id}`}
											className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold">
											Profile
										</Link>
										<Link
											href="/create-booking"
											className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold ">
											Book Service
										</Link>
										<Link
											href="/manage-booking"
											className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold transition duration-300">
											Manage Booking
										</Link>
									</>

								) : null}
								<Link
									href="/contact-us"
									className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold transition duration-300">
									Contact Us
								</Link>
							</div>
							<AuthShowcase userData={userData} isSignedIn={isSignedIn as boolean} />
							<div className="md:hidden flex items-center">
								<button className="ml-6 outline-none mobile-menu-button" onClick={handleClick}>
									{!menuToggled ? (
										<svg
											className="w-8 h-8 text-gray-900"
											x-show="!showMenu"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path d="M4 6h16M4 12h16M4 18h16"></path>
										</svg>
									) : (
										<svg
											className="w-8 h-8 text-gray-900 mr-4"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true">
											<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
										</svg>
									)
									}
								</button>
							</div>
						</div>
					</div>
					{/* mobile */}
					<ul className={`md:hidden flex-wrap ${!menuToggled ? "hidden" : ""} mobile-menu flex justify-center items-center text-white bg-[#060606]`}>
						<Link
							href="/"
							className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold ">
							Home
						</Link>
						{isSignedIn ? (
							<>
								<Link
									href={`/profile/${userId}`}
									className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold">
									Profile
								</Link>
								<Link
									href="/create-booking"
									className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold ">
									Book Service
								</Link>
								<Link
									href="/manage-booking"
									className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold transition duration-300">
									Manage Booking
								</Link>
							</>
						) : null}
						<Link
							href="/contact-us"
							className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold transition duration-300">
							Contact Us
						</Link>
					</ul>
				</div>
			</nav>
		)
	}

	const AdminViewNavigation = () => {
		return (
			<nav className="bg-white shadow-lg" role="navigation" aria-label="navigation">
				<div className={`${!menuToggled ? 'transition-ease max-w-7xl mx-auto px-4' : 'px-0'}`}>
					<div className="flex justify-between align-start">
						<Link href="https://www.mnmk9.ca" className="flex items-center md:py-4 md:px-2 h-32">
							<Logo />
						</Link>
						<div className={`flex items-center`}>
							<div className="hidden md:flex items-center">
								<>
									<Link
										href="/dashboard"
										className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold ">
										Dashboard
									</Link>
									<Link
										href="/users"
										className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold ">
										Users
									</Link>
									<Link
										href="/create-booking"
										className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold ">
										Book Service
									</Link>
									<Link
										href="/manage-booking"
										className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold transition duration-300">
										Manage Bookings
									</Link>
								</>
							</div>
							<AuthShowcase userData={userData} isSignedIn={isSignedIn as boolean} />
							<div className="md:hidden flex items-center">
								<button className="ml-6 outline-none mobile-menu-button" onClick={handleClick}>
									{!menuToggled ? (
										<svg
											className="w-8 h-8 text-gray-900"
											x-show="!showMenu"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path d="M4 6h16M4 12h16M4 18h16"></path>
										</svg>
									) : (
										<svg
											className="w-8 h-8 text-gray-900 mr-4"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true">
											<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
										</svg>
									)}
								</button>
							</div>
						</div>
					</div>
					{/* mobile */}
					<ul className={`md:hidden flex-wrap ${!menuToggled ? "hidden" : ""} mobile-menu flex justify-center items-center text-white bg-[#060606]`}>
						<Link
							href="/dashboard"
							className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold ">
							Dashboard
						</Link>
						<Link
							href="/users"
							className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold ">
							Users
						</Link>
						<Link
							href="/create-booking"
							className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold ">
							Book Service
						</Link>
						<Link
							href="/manage-booking"
							className="py-4 px-5 text-black-700 hover:text-red-700 font-semibold transition duration-300">
							Manage Bookings
						</Link>
					</ul>
				</div>
			</nav>
		)
	}

	return (
		<>
			{isSignedIn && userData?.role === "user" ? (
				<ClientViewNavigation />
			) : <AdminViewNavigation />}
		</>
	)
}

export default Navbar;