import { type NextPage } from "next";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import training from "../../../public/training.png"
import boarding from "../../../public/boarding.jpg";
import grooming from "../../../public/grooming.jpg";
import daycare from "../../../public/daycare.webp";
import { useUser } from "@clerk/nextjs";

const cards = [
  {
    service: "Boarding",
    href: "/create-booking/boarding",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    imageSrc: boarding,
    price: "$30/night",
  },
  {
    service: "Daycare",
    href: "/create-booking/daycare",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    imageSrc: daycare,
    price: "$20/day",
  },
  {
    service: "Grooming",
    href: "/create-booking/grooming",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    imageSrc: grooming,
    price: "*varies per dog size/breed",
  },
  {
    service: "Training",
    href: "/create-booking/training",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    imageSrc: training,
    price: "$60/hr",
  }
]

const CreateBooking: NextPage = () => {
  const { isSignedIn } = useUser();
  return (
    <>
      {
        isSignedIn ? (
          <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Book a  <span className="text-[rgb(103,163,161)]">Service</span>
            </h1>
            <h2 className="text-3xl font-bold text-white text-center">Select a Service that you want to book</h2>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 md:gap-8 my-20">
              {
                cards && cards.map(card => {
                  return (
                    <Link
                      className="flex max-w-sm flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                      href={card.href}
                      key={card.service}
                    >
                      <div className="flex justify-center">
                        <div className="rounded-lg shadow-lg bg-white max-w-md">
                          <Image className="rounded-t-lg" style={{ height: "300px", objectFit: "cover" }} src={card.imageSrc} alt="" />
                          <div className="p-6">
                            <h2 className="text-gray-900 text-xl font-medium mb-2">{card.service}</h2>
                            <p className="text-gray-700 text-base mb-4">
                              {card.text}
                            </p>
                            <p className="text-gray-600 font-bold text-xs">{card.price}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })
              }
            </div>
          </div>
        ) : (
          <div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Please Login to book a service</h1>
          </div>
        )
      }
    </>
  );
};

export default CreateBooking;