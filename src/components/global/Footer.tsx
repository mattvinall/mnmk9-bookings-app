import Link from "next/link";

const Footer = () => {
	return (
		<footer className="p-4 bg-white rounded-lg text-center shadow md:text-left md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
			<span className="text-sm text-gray-500 sm:text-center dark:text-gray-100">© 2022 <a href="https://www.mnmk9.ca" className="hover:underline">MNMK-9</a>. All Rights Reserved.
			</span>
			<ul className="flex flex-wrap items-center justify-center md:justify-start text-sm text-gray-100 dark:text-gray-100 sm:mt-3">
				<li>
					<Link href="/about" className="mr-4 hover:underline md:mr-6 ">About</Link>
				</li>
				<li>
					<Link href="https://www.mnmk9.ca" target="_blank" rel="noreferrer" className="mr-4 hover:underline md:mr-6">MNMK-9 Website</Link>
				</li>
				<li>
					<Link href="/contact-us" className="hover:underline">Contact</Link>
				</li>
			</ul>
		</footer>
	)
}

export default Footer