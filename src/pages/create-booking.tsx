import { type NextPage } from "next";
import Link from "next/link";

const cards = [
  {
    service: "Boarding",
    href: "/create-booking/boarding",
    text: ""
  }
]

const CreateBooking: NextPage = () => {
  return (
    <>
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Book a  <span className="text-[hsl(280,100%,70%)]">Service</span>
        </h1>
        <h2 className="text-3xl font-bold text-white">Select a Service that you want to book</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2 md:gap-8 my-20">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/create-booking/boarding"
          >
            <div className="flex justify-center">
              <div className="rounded-lg shadow-lg bg-white max-w-md">
                <img className="rounded-t-lg" src="https://mdbootstrap.com/img/new/standard/nature/184.jpg" alt="" />
                <div className="p-6">
                  <h2 className="text-gray-900 text-xl font-medium mb-2">Boarding</h2>
                  <p className="text-gray-700 text-base mb-4">
                    Some quick example text to build on the card title and make up the bulk of the card's
                    content.
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/create-booking/daycare"
          >
            <div className="flex justify-center">
              <div className="rounded-lg shadow-lg bg-white max-w-sm">
                <img className="rounded-t-lg" src="https://mdbootstrap.com/img/new/standard/nature/185.jpg" alt="" />
                <div className="p-6">
                  <h2 className="text-gray-900 text-xl font-medium mb-2">Daycare</h2>
                  <p className="text-gray-700 text-base mb-4">
                    Some quick example text to build on the card title and make up the bulk of the card's
                    content.
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/create-booking/grooming"
          >
            <div className="flex justify-center">
              <div className="rounded-lg shadow-lg bg-white max-w-sm">
                <img className="rounded-t-lg" src="https://mdbootstrap.com/img/new/standard/nature/186.jpg" alt="" />
                <div className="p-6">
                  <h2 className="text-gray-900 text-xl font-medium mb-2">Grooming</h2>
                  <p className="text-gray-700 text-base mb-4">
                    Some quick example text to build on the card title and make up the bulk of the card's
                    content.
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/create-booking/training"
          >
            <div className="flex justify-center">
              <div className="rounded-lg shadow-lg bg-white max-w-sm">
                <img className="rounded-t-lg" src="https://mdbootstrap.com/img/new/standard/nature/187.jpg" alt="" />
                <div className="p-6">
                  <h2 className="text-gray-900 text-xl font-medium mb-2">Training</h2>
                  <p className="text-gray-700 text-base mb-4">
                    Some quick example text to build on the card title and make up the bulk of the card's
                    content.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CreateBooking;