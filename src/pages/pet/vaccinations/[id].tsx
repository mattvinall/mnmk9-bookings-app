import { NextPage } from 'next';

const Vaccinations: NextPage = () => {
    return (
        <section className="flex flex-col items-center justify-start gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-16">
                Edit <span className="text-[rgb(103,163,161)]">Vaccinations</span>
            </h1>
        </section>
    )
}

export default Vaccinations; 