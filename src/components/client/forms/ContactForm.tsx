"use client";

import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useEffect, useCallback } from "react";
import {
	useGoogleReCaptcha,
	GoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { ContactFormTypeProps } from "../../../types/form-types";

const ContactForm = ({ handleSubmit, setToken, register, onSubmit, isSubmitting }: ContactFormTypeProps): ReactJSXElement => {
	const rows = 6;
	const { executeRecaptcha } = useGoogleReCaptcha()
	// Create an event handler so you can call the verification on button click event or form submit
	const handleReCaptchaVerify = useCallback(async () => {
		if (!executeRecaptcha) {
			console.log('Execute recaptcha not yet available');
			return;
		}

		const token = await executeRecaptcha('contactForm');
		setToken(token)
		console.log("token", token);
		// Do whatever you want with the token
	}, [executeRecaptcha]);

	// You can use useEffect to trigger the verification as soon as the component being loaded
	useEffect(() => {
		handleReCaptchaVerify();
	}, [handleReCaptchaVerify]);

	return (
		<>
			<form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
				<GoogleReCaptcha onVerify={handleReCaptchaVerify} action="contactForm" />
				<div className="relative z-0 mb-6 w-full group">
					<label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-100 dark:text-gray-100">Name</label>
					<input
						{...register("name", { required: true })}
						type="text"
						id="name"
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
						placeholder="John Smith"
						required
					/>
				</div>
				<div className="relative z-0 mb-6 w-full group">
					<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Your email</label>
					<input
						{...register("email", { required: true })}
						type="email"
						id="email"
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
						placeholder="john@company.com"
						required
					/>
				</div>
				<div className="sm:col-span-2 relative z-0 mb-6 w-full group">
					<label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-100 dark:text-gray-100">Your message</label>
					<textarea
						{...register("message", { required: true })}
						id="message"
						rows={rows}
						className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
						placeholder="Please explain the issue that you are experiencing"
						required
					/>
				</div>
				<button disabled={isSubmitting} type="submit" className="rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-10 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send message</button>
			</form>
		</>
	)
}

export default ContactForm;