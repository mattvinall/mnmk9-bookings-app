"use-client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import UserDetailForm from "../../components/forms/UserDetailForm";
import AddPetForm from "../../components/forms/AddPetForm";
import Swal from "sweetalert2";

const UserDetail: () => void = () => {
	const router = useRouter();
	const userId = router.query.id as string;
	const { data: userDetail, isLoading, refetch, error } = trpc.user.byId.useQuery({ id: userId });

	console.log("user detail", userDetail);

	const [showUserForm, setShowUserForm] = useState<boolean>(false);
	const [showPetForm, setShowPetForm] = useState<boolean>(false);

	const handleShowUserForm = () => {
		setShowUserForm(true);
		setShowPetForm(false);
	}

	const handleShowPetForm = () => {
		setShowPetForm(true);
		setShowUserForm(false);
	}

	const deletePet = trpc.pet.deletePet.useMutation();

	const handleDeletePet = async (id: string, name: string) => {
		try {
			Swal.fire({
				title: `Are you sure you want to Remove ${name} from your profile?`,
				showDenyButton: true,
				confirmButtonText: 'Yes',
			}).then((result) => {
				if (result.isConfirmed) {
					// delete pet by id
					deletePet.mutate({ id });

					Swal.fire(`Successfully Deleted ${name} from your profile and our database.`, '', 'success').then(result => {
						if (result) {
							refetch();
						}
					});
				}
			});

		} catch (error) {
			// error message
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `Something went wrong! ${error}`,
			});
		}
	}

	if (isLoading) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Loading....</h1>
		</div>
	);

	if (error) router.push("/");

	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
				Manage  <span className="text-[hsl(280,100%,70%)]">Profile</span>
			</h1>
			<p className="text-white text-center w-[80%] font-bold sm:text-[2.5rem]">
				Manage Your Information or Add Pets to your Profile
			</p>
			<div className="flex justify-center">
				<button onClick={handleShowUserForm} className="mt-[25px] mx-6 rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Manage Profile</button>
				<button onClick={handleShowPetForm} className="mt-[25px] mx-6 rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Add Pet(s)</button>
			</div>
			<>{showUserForm && (<UserDetailForm setShowUserForm={setShowUserForm} />)}</>
			<>{showPetForm && (<AddPetForm setShowPetForm={setShowPetForm} />)}</>
			{userDetail?.pets && <h2 className="text-white text-left font-bold sm:text-[2.5rem]">Your Pets</h2>}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 md:gap-8 mt-10">
				{userDetail?.pets?.map((pet, i) => {
					return (
						<div key={pet.name} className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
							<div className="flex justify-center">
								<div className="rounded-lg shadow-lg bg-white max-w-md">
									<img className="rounded-t-lg w-full h-[300px] w-[300px] object-cover" src={`https://mdbootstrap.com/img/new/standard/nature/18${i}.jpg`} alt={`an image of a ${pet.breed} named ${pet.name}`} />
									<div className="p-6">
										<h2 className="text-gray-900 text-xl font-medium mb-2">{pet.name}</h2>
										<p className="text-gray-700 text-base mb-4">{pet.breed}</p>
										<p className="text-gray-600 font-bold text-xs">Vaccinated: {pet?.vaccinated === false ? "No" : "Yes"}</p>
										<div className="flex bg-white">
											<Link href={`/pet/${pet.id}`} className="mt-6 flex flex-col items-center justify-center w-12 h-12 mr-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-full focus:shadow-outline hover:bg-indigo-800">
												<svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
												<p className="text-xs text-gray-100">Edit</p>
											</Link>
											<button name="delete-pet" onClick={() => handleDeletePet(pet.id, pet.name)} className="mt-6 ml-4 flex flex-col items-center justify-center w-12 h-12 mr-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-full focus:shadow-outline hover:bg-indigo-800">
												<svg className="w-4 h-4" fill="#fff" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
												<p className=" text-xs text-gray-100">Delete</p>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</div >
	)
}

export default UserDetail;