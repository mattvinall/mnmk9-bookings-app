"use-client";

import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

const Users = () => {
	// get user session
	const { data: sessionData } = useSession();
	// get the id from the user session
	const id = sessionData?.user?.id as string;

	// fetch user by id 
	const { data: userData, isLoading, error } = trpc.user.byId.useQuery({ id });

	// fetch all users
	const { data: allUserData } = trpc.user.getAllUsers.useQuery();

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [searchResults, setSearchResults] = useState(allUserData);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setSearchTerm(query);

		const filteredUsers = allUserData?.filter((user) => {
			const userPets = user.pets.map((pet) => pet.name.toLowerCase());
			return (
				user.name.toLowerCase().includes(query.toLowerCase()) ||
				userPets.includes(query.toLowerCase())
			);
		});
		setSearchResults(filteredUsers);
	};

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
	return (
		<>
			{userData?.role === "admin" && sessionData ? (
				<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
						MNMK-9  <span className="text-[hsl(280,100%,70%)]">Users</span>
					</h1>
					<label htmlFor="simple-search" className="sr-only">Search</label>
					<div className="relative w-[35%]">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-100" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
						</div>
						<input onChange={handleSearch} value={searchTerm} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by user or pet..." required />
					</div>
					{/* display results */}
					<ul className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 md:gap-8 mt-10">
						{(searchResults || allUserData)?.map((user, idx) => (
							<li key={user?.id}>
								<a href={`/profile/${user.id}`} className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-2 text-white hover:bg-white/20">
									<div className="flex justify-center">
										<div className="rounded-lg shadow-lg bg-white max-w-md w-full h-full min-h-[320px]">
											<img className="rounded-full scale-50 float-right" src={user?.image as string} />
											<div className="p-6">
												<h2 className="text-gray-900 text-xl font-bold mb-2">{user?.name}</h2>
												{user?.phoneNumber ? <p className="text-gray-700 font-medium text-base mb-4">{user?.phoneNumber}</p> : <p className="text-gray-700 font-medium mb-4">No phone number added...</p>}
												{user?.address && user?.city && user?.postalCode ? <p className="text-gray-700 text-base mb-4">{user?.address}, {user?.city}. {user?.postalCode}</p> : <div><p className="text-gray-900">No Address Added...</p><br /></div>}
												<h3 className="text-gray-900 font-bold">Pets:</h3>
												<ul className="flex flex-wrap pl-[0px]">
													{user?.pets && user?.pets?.length > 0 ? user?.pets?.map(pet => <li key={pet.id}><a href={`/pet/${pet.id}`}><img className="w-[75px] h-[75px] rounded-full scale-50" src={pet.profileImage as string || `https://mdbootstrap.com/img/new/standard/nature/19${idx}.jpg`} /><p className="text-gray-900 text-center">{pet.name}</p></a></li>) : <p className="text-gray-900 font-medium">No pets added to profile...</p>}
												</ul>
											</div>
										</div>
									</div>
								</a>
							</li>
						))}
					</ul>
				</div >
			) : (
				<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Error 403: Forbidden</h1>
				</div>
			)}
		</>
	)
}

export default Users;