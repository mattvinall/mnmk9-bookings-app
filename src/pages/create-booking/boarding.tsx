import React from 'react'
import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


const schema = z.object({
	name: z.string(),
	checkInDate: z.date(),
	checkoutDate: z.date(),
})

const Boarding: NextPage = () => {


	const { register, handleSubmit, watch, formState: { errors } } = useForm({
		resolver: zodResolver(schema)
	});

	const onSubmit = data => console.log(data);

	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-16">
				Book <span className="text-[hsl(280,100%,70%)]">Boarding</span>
			</h1>
		</div>
	)
}

export default Boarding;