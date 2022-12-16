import { type NextPage } from "next";
import Link from "next/link";

const cards = [
  {
    service: "Boarding",
    href: "/create-booking/boarding",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    imageSrc: "https://mdbootstrap.com/img/new/standard/nature/185.jpg",
    price: "$30/night",
  },
  {
    service: "Daycare",
    href: "/create-booking/daycare",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    imageSrc: "https://mdbootstrap.com/img/new/standard/nature/186.jpg",
    price: "$20/day",
  },
  {
    service: "Grooming",
    href: "/create-booking/grooming",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    imageSrc: "https://mdbootstrap.com/img/new/standard/nature/187.jpg",
    price: "*varies per dog size/breed",
  },
  {
    service: "Training",
    href: "/create-booking/training",
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    imageSrc: "https://mdbootstrap.com/img/new/standard/nature/188.jpg",
    price: "$60/hr",
  }
]

const CreateBooking: NextPage = () => {
  return (
    <>
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Book a  <span className="text-[hsl(280,100%,70%)]">Service</span>
        </h1>
        <h2 className="text-3xl font-bold text-white text-center">Select a Service that you want to book</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2 md:gap-8 my-20">
          {
            cards && cards.map(card =>{
              return (
                <Link
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                  href={card.href}
                >
                  <div className="flex justify-center">
                    <div className="rounded-lg shadow-lg bg-white max-w-md">
                      <img className="rounded-t-lg" src={card.imageSrc} alt="" />
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
    </>
  );
};

export default CreateBooking;