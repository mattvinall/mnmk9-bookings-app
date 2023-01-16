import { useState, useMemo } from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
import Image from 'next/image';
import Link from 'next/link';
import logo from "../../public/mnmk9-logo.jpg";

const Logo = () => {
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

	const userImage = useMemo(() => {
		return sessionData && sessionData?.user?.image;
	}, [sessionData?.user?.image])

	const userName = useMemo(() => {
		return sessionData && sessionData?.user?.name
	}, [sessionData?.user?.name])

	return (
		<div className="flex items-center">
			<p className="text-small text-purple pl-24">
				{sessionData && <span className="font-semibold">{userName}</span>}
			</p>
			{userImage && <span><img className="rounded-full scale-50 float-right" src={userImage} /></span>}
			<button
				className="rounded-full bg-gradient-to-b from-[#2e026d] to-[#15162c] px-10 py-3 font-semibold text-white no-underline transition hover:bg-gradient-to-b from-[#15162c] to-[#2e026d]"
				onClick={sessionData ? () => signOut() : () => signIn()}
			>
				{sessionData ? "Sign out" : "Sign in"}
			</button>
		</div>
	);
};


const Navbar: React.FC = () => {
	const { data: sessionData } = useSession();
	// const userId = data?.id;
	// const [menuToggled, setMenuToggled] = useState(false);
	// const handleClick = () => {
	// 	console.log("icon clicked", menuToggled);
	// 	setMenuToggled((prevState) => !prevState);
	// }

	return (
		<nav className="bg-white shadow-lg">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-between align-start">
					<div className="flex items-center h-32">
						<div>
							<Link href="https://www.mnmk9.ca" className="flex items-center py-4 px-2">
								<Logo />
							</Link>
						</div>
						<div className="hidden md:flex items-center">
							<Link
								href="/"
								className="py-4 px-5 text-black-700 hover:text-purple-700 font-semibold ">
								Home
							</Link>
							<Link
								href={`/profile/${sessionData?.user?.id}`}
								className="py-4 px-5 text-black-700 hover:text-purple-700 font-semibold">
								Profile
							</Link>
							<Link
								href="/create-booking"
								className="py-4 px-5 text-black-700 hover:text-purple-700 font-semibold ">
								Book Service
							</Link>
							<Link
								href="/manage-booking"
								className="py-4 px-5 text-black-700 hover:text-purple-700 font-semibold transition duration-300">
								Manage Booking
							</Link>
							<Link
								href="/contact-us"
								className="py-4 px-5 text-black-700 hover:text-purple-700 font-semibold transition duration-300">
								Contact Us
							</Link>
						</div>
						<AuthShowcase />
						{/* <div className="md:hidden flex items-center">
							<button className="outline-none mobile-menu-button" onClick={handleClick}>
								<svg className=" w-6 h-6 text-gray-500 "
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
							</button>
						</div> */}
					</div>
				</div>
				{/* mobile */}
				{/* <div className={`${!menuToggled ? "hidden" : ""} mobile-menu`}>
					<ul className="">
						<li className="active"><a href="/create-booking" className="block text-md px-2 py-4 text-white bg-green-500 font-semibold">Book a Service</a></li>
						<li><a href="/manage-booking" className="block text-md px-2 py-4 hover:bg-green-500 transition duration-300">Manage A Service</a></li>
						<li><a href="/contact" className="block text-md px-2 py-4 hover:bg-green-500 transition duration-300">Contact Us</a></li>
					</ul>
				</div> */}
			</div>
		</nav>
	)
}

export default Navbar;