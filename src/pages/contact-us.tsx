"use client";

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../utils/trpc";
import { zodResolver } from '@hookform/resolvers/zod';
import ContactForm from '../components/client/forms/ContactForm';
import Swal from "sweetalert2";
import { sendEmailContactForm } from "../lib/email";
import type { ContactFormType } from '../types/form-types';
import { contactFormSchema } from '../utils/schema';
import {
	GoogleReCaptchaProvider,
} from 'react-google-recaptcha-v3';

const ContactUs = () => {
	const router = useRouter();

	const [token, setToken] = useState<string>("");
	const [key, setKey] = useState<string>("");
	const [secret, setSecret] = useState<string>("");
	const [score, setScore] = useState<number | null>(null);

	useEffect(() => {
		const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;
		const secret = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET;

		if (key && key !== undefined) {
			setKey(key);
		}

		if (secret || secret !== undefined) {
			setSecret(secret);
		}
	}, []);

	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormType>({
		resolver: zodResolver(contactFormSchema)
	});

	const addNewContactFormEntry = trpc.contact.newContactEmail.useMutation();

	const verifyRecaptcha = trpc.recaptcha.verify.useMutation({
		onSuccess(data) {
			if (!data) return;
			setScore(data.score);
		},
		onError(error) {
			console.log("error verify recaptcha mutation", error);
		}
	});


	const onSubmit: SubmitHandler<ContactFormType> = async (formData: any) => {
		try {
			verifyRecaptcha.mutate({ token, secret });

			if (score && score < 0.5) {
				console.log("score is less than 0.5");
				return;
			}

			addNewContactFormEntry.mutate(formData);

			reset();

			// call send email function that leverages AWS SES to send the form data via email
			await sendEmailContactForm(
				formData?.email,
				"matt.vinall7@gmail.com",
				formData?.name,
				formData?.message
			);

			// success message 
			Swal.fire({
				icon: 'success',
				title: `Sent`,
				text: `Successfully sent your request to our technical support team. We will try and get back to you in 24-48 hours. Thank you for your patience. `,
			}).then((result) => {
				if (result.isConfirmed) {
					// navigate to home page on submit
					router.push("/");
				}
			});
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `Something went wrong! ${error}`,
			});
		}
	}
	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-8 md:py-16">
				Contact <span className="text-[hsl(280,100%,70%)]">Us</span>
			</h1>
			<section className="px-4 mx-auto max-w-screen-md">
				<p className="mb-8 lg:mb-16 font-medium text-center dark:text-gray-100 sm:text-xl">Got a technical issue? Have trouble booking or managing a service? Let us know.</p>
				{key && key !== undefined ? (
					<GoogleReCaptchaProvider reCaptchaKey={key}>
						<ContactForm
							setToken={setToken}
							onSubmit={onSubmit}
							handleSubmit={handleSubmit as any}
							isSubmitting={isSubmitting}
							register={register as any}
						/>
					</GoogleReCaptchaProvider>
				) : null}
			</section>
		</div>
	)
}

export default ContactUs;