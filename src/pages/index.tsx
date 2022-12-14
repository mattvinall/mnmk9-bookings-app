import { type NextPage } from "next";
import Navbar from "./components/Navbar";
import Head from "next/head";
import Link from "next/link";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>MNMK-9 Bookings App</title>
        <meta name="description" content="MNMK-9 Booking App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            MNMK-9 <span className="text-[hsl(280,100%,70%)]">Bookings</span>
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/create-booking"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Create Booking →</h3>
              <div className="text-lg">
                Click to book a service with Tyler
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Manage a Booking →</h3>
              <div className="text-lg">
                If you need to modify a booking for your fur baby
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;