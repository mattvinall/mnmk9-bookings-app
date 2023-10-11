import React, { ReactNode } from 'react'
import Head from "next/head";
import Navbar from "./Navbar";
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
            <header>
                <Navbar />
            </header>
            <main className="min-h-[100vh] flex justify-center bg-gradient-to-b from-[#AC0D0D] to-[#201E1F]">
                {children}
            </main>
            <Footer />
        </>

    )
}

export default MainLayout;