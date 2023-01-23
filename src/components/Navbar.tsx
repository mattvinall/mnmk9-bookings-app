import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from 'next/image';
import Link from 'next/link';
import logo from "../../public/mnmk9-logo.jpg";
import { trpc } from "../utils/trpc"

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

	const { data: userData } = trpc.user.byEmail.useQuery({ email: sessionData?.user?.email as string });
	console.log("user", userData);


	return (
		<div className="flex items-center">
			<p className="text-small text-purple pl-0 md:pl-24">
				{userData && <Link href={`/profile/${userData.id}`}><span className="font-semibold">{userData?.name}</span></Link>}
			</p>
			{sessionData && <span><img className="rounded-full scale-50 float-right" src={sessionData?.user?.image as string} /></span>}
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
	const [menuToggled, setMenuToggled] = useState(false);
	const handleClick = () => {
		setMenuToggled((prevState) => !prevState);
	}

	return (
		<nav className="bg-white shadow-lg" role="navigation" aria-label="navigation">
			<div className={`${!menuToggled ? 'transition-ease max-w-7xl mx-auto px-4' : 'px-0'}`}>
				<div className={`flex ${sessionData ? 'justify-between' : 'justify-center'} align-start`}>
					<div className={`flex items-center h-32`}>
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
							{sessionData ? (
								<>
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
								</>

							) : null}
							<Link
								href="/contact-us"
								className="py-4 px-5 text-black-700 hover:text-purple-700 font-semibold transition duration-300">
								Contact Us
							</Link>
						</div>
						<AuthShowcase />
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
										stroke-width="1.5"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
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
						className="py-4 px-5 text-black-700 hover:text-purple-700 font-semibold ">
						Home
					</Link>
					{sessionData ? (
						<>
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
						</>
					) : null}
					<Link
						href="/contact-us"
						className="py-4 px-5 text-black-700 hover:text-purple-700 font-semibold transition duration-300">
						Contact Us
					</Link>
				</ul>
			</div>
		</nav>
	)
}

export default Navbar;