import React from 'react'
import { type NextPage } from "next";


const Daycare: NextPage = () => {
	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-16">
				Book <span className="text-[hsl(280,100%,70%)]">Daycare</span>
			</h1>
		</div>
	)
}

export default Daycare;