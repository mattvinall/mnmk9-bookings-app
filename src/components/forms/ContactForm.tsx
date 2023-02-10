"use-client";

type Props = {
	isSubmitting: boolean,
	register: any,
	handleSubmit: any,
	onSubmit: any,
}

const ContactForm = ({ handleSubmit, register, onSubmit, isSubmitting }: Props) => {
	const rows = 6;
	return (
		<>
			<form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
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