import React from 'react'
import { type NextPage } from "next";


const ContactUs: NextPage = () => {
	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-16">
				Contact <span className="text-[hsl(280,100%,70%)]">Us</span>
			</h1>
			<section className="px-4 mx-auto max-w-screen-md">
				<p className="mb-8 lg:mb-16 font-medium text-center dark:text-gray-100 sm:text-xl">Got a technical issue? Have trouble booking or managing a service? Let us know.</p>
				<form action="#" className="space-y-8">
					<div>
						<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Your email</label>
						<input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-100 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-100 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="john@company.com" required />
					</div>
					<div>
						<label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-100 dark:text-gray-100">Subject</label>
						<input type="text" id="subject" className="block p-3 w-full text-sm text-gray-100 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-100 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Let us know how we can help you" required />
					</div>
					<div className="sm:col-span-2">
						<label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-100 dark:text-gray-100">Your message</label>
						<textarea id="message" rows="6" className="block p-2.5 w-full text-sm text-gray-100 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-100 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..."></textarea>
					</div>
					<button type="submit" className="rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-10 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send message</button>
				</form>
			</section>
		</div>
	)
}

export default ContactUs