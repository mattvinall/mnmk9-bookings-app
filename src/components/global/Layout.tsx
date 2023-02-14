import React, { ReactNode } from 'react'
import Head from "next/head";
import Navbar from "../client/Navbar";
import Footer from "./Footer";
interface ILayoutProps {
	children: NonNullable<ReactNode>;
}

const MainLayout = ({ children }: ILayoutProps) => {
	return (
		<>
			<Head>
				<title>MNMK-9 Bookings App</title>
				<meta name="description" content="MNMK-9 Booking App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Navbar />
			<main className="lex min-h-[85vh] flex justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
				{children}
			</main>
			<Footer />
		</>
	)
}

export default MainLayout;