import React, { ReactNode } from 'react'
import Script from "next/script";
import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
interface ILayoutProps {
    children: NonNullable<ReactNode>;
}

const MainLayout = ({ children }: ILayoutProps) => {
    return (
        <html>
            <Head>
                <title>MNMK-9 Bookings App</title>
                <meta name="description" content="MNMK-9 Booking App" />
                <link rel="icon" href="/favicon.ico" />
                {/* <script src="https://clerk.mnmk9-bookings.app/npm/@clerk/clerk-js@4/dist/clerk.browser.js"></script> */}
            </Head>
            <Navbar />
            <main className="min-h-[85vh] flex justify-center bg-gradient-to-b from-[#112C4F] to-[#15162c]">
                {children}
            </main>
            <Footer />
        </html>
    )
}

export default MainLayout;