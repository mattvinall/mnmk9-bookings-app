import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Navbar from "./components/Navbar";

import { trpc } from "../utils/trpc";

const CreateBooking: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>MNMK-9 Bookings App</title>
        <meta name="description" content="MNMK-9 Booking App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex min-h-screen flex justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Book a Service</span>
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/create-booking/boarding"
            >
              <h3 className="text-2xl font-bold text-center">Boarding</h3>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/create-booking/daycare"
            >
              <h3 className="text-2xl font-bold text-center">Daycare</h3>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/create-booking/grooming"
            >
              <h3 className="text-2xl font-bold text-center">Grooming</h3>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/create-booking/training"
            >
              <h3 className="text-2xl font-bold text-center">Training</h3>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default CreateBooking;