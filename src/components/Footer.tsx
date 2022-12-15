import React from 'react'


const Footer = () => {
	return (
		<footer className="p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
			<span className="text-sm text-gray-500 sm:text-center dark:text-gray-100">© 2022 <a href="https://www.mnmk9.ca" className="hover:underline">MNMK-9</a>. All Rights Reserved.
			</span>
			<ul className="flex flex-wrap items-center mt-3 text-sm text-gray-100 dark:text-gray-100 sm:mt-0">
				<li>
					<a href="/about" className="mr-4 hover:underline md:mr-6 ">About</a>
				</li>
				<li>
					<a href="https://www.mnmk9.ca" target="_blank" className="mr-4 hover:underline md:mr-6">MNMK-9 Website</a>
				</li>
				<li>
					<a href="/contact-us" className="hover:underline">Contact</a>
				</li>
			</ul>
		</footer>
	)
}

export default Footer