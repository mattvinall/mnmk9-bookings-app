import { useState, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

const Pets = () => {
	// get user session
	const { data: sessionData } = useSession();
	// get the id from the user session
	const id = sessionData?.user?.id as string;
	// fetch user by id 
	const { data: userData } = trpc.user.byId.useQuery({ id });

	// fetch bookings if user role is admin
	const { data: allUserData, isLoading, error } = trpc.user.getAllUsers.useQuery();

	if (!sessionData) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Please Login....</h1>
		</div>
	)

	if (isLoading) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Loading....</h1>
		</div>
	);

	if (error) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Error....please contact support</h1>
		</div>
	);

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [searchResults, setSearchResults] = useState(allUserData);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setSearchTerm(query);
	};

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			const filteredUsers = allUserData?.filter((user) => {
				const userPets = user.pets.map((pet) => pet.name.toLowerCase());
				return (
					userPets.includes(searchTerm.toLowerCase()) ||
					user.name.toLowerCase().includes(searchTerm.toLowerCase())
				);
			});
			setSearchResults(filteredUsers);
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [searchTerm, allUserData]);

	return (
		<>
			{userData?.role === "admin" && sessionData ? (
				<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
						MNMK-9  <span className="text-[hsl(280,100%,70%)]">Bookings</span>
					</h1>
					<label htmlFor="simple-search" className="sr-only">Search</label>
					<div className="relative w-[35%]">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-100" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
						</div>
						<input onChange={handleSearch} value={searchTerm} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Users, Pets..." required />
					</div>
					{/* display results */}
					<ul>
						{searchResults?.map((user) => (
							<li className="text-white text-md" key={user.id}>
								{user.name} ({user.pets.map((pet) => pet.name).join(', ')})
							</li>
						))}
					</ul>
				</div>
			) : (
				<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Error 403: Forbidden</h1>
				</div>
			)}
		</>
	)

}

export default Pets;