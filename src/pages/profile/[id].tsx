"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import UserDetailForm from "../../components/client/forms/UserDetailForm";
import AddPetForm from "../../components/client/forms/AddPetForm";
import UserInfoTable from "../../components/client/UserInfoCard";
import Swal from "sweetalert2";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const UserDetail = () => {
	const router = useRouter();
	const userId = router.query.id as string;

	const [showUserForm, setShowUserForm] = useState<boolean>(false);
	const [showPetForm, setShowPetForm] = useState<boolean>(false);
	const [showPets, setShowPets] = useState<boolean>(false);
	const [showProfileTable, setShowProfileTable] = useState<boolean>(false);
	const [key, setKey] = useState<string>("")
	const [secret, setSecret] = useState<string>("");

	const { data: userDetail, isLoading, refetch, error } = trpc.user.byId.useQuery({ id: userId });

	const handleShowUserForm = () => {
		setShowUserForm(true);
		setShowPetForm(false);
		setShowPets(false);
		setShowProfileTable(false);
	}

	const handleShowPetForm = () => {
		setShowPetForm(true);
		setShowUserForm(false);
		setShowPets(false);
		setShowProfileTable(false);
	}

	const handleShowPets = () => {
		setShowPets(true);
		setShowPetForm(false);
		setShowUserForm(false);
		setShowProfileTable(false);
	}

	const handleShowProfileTable = () => {
		setShowProfileTable(true);
		setShowPets(false);
		setShowPetForm(false);
		setShowUserForm(false);
	}

	useEffect(() => {
		setShowPets(true);
	}, [])

	useEffect(() => {
		const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;
		const secret = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET;

		if (!key) return;
		if (!secret) return;

		setKey(key);
		setSecret(secret);
	}, [key, secret]);

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
				Manage  <span className="text-[rgb(103,163,161)]">Profile</span>
			</h1>
			<p className="text-white text-center w-[80%] font-bold text-[2rem] md:text-[2.5rem]">
				Manage Your Information or Add Pets to your Profile
			</p>

			{/* Tabs */}
			<div className="text-md font-medium text-center text-gray-500 border-b border-gray-500 dark:text-gray-400 dark:border-gray-500">
				<ul className="flex flex-wrap">
					<li>
						<button onClick={handleShowPets} className={`${showPets === true ? "text-gray-100 !border-gray-100 border-b-2" : ""} inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-100 hover:border-gray-100`}>Your Pets</button>
					</li>
					<li>
						<button onClick={handleShowProfileTable} className={`${showProfileTable === true ? "text-gray-100 !border-gray-100 border-b-2" : ""} inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-100 hover:border-gray-100`}>Your Profile</button>
					</li>
					<li className="mr-2">
						<button onClick={handleShowUserForm} className={`${showUserForm === true ? "text-gray-100 !border-gray-100 border-b-2" : ""} inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-100 hover:border-gray-100`}>Edit Profile</button>
					</li>
					<li className="mr-2">
						<button onClick={handleShowPetForm} className={`${showPetForm === true ? "text-gray-100 !border-gray-100 border-b-2" : ""} inline-block p-4 rounded-t-lg border-transparent hover:text-gray-100 hover:border-gray-100`}>Add Pet</button>
					</li>
					<li className="mr-2">
						<button className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-100 hover:border-gray-100">Download Waiver</button>
					</li>
					<li className="mr-2">
						<button className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-100 hover:border-gray-100">Upload Waiver</button>
					</li>
				</ul>
			</div>

			{/* Content */}


			{showUserForm && key !== undefined && key && (
				<GoogleReCaptchaProvider reCaptchaKey={key}>
					<UserDetailForm setShowUserForm={setShowUserForm} secret={secret} />
				</GoogleReCaptchaProvider>)}
			{showPetForm && key !== undefined && key && (
				<GoogleReCaptchaProvider reCaptchaKey={key}>
					<AddPetForm setShowPetForm={setShowPetForm} secret={secret} />
				</GoogleReCaptchaProvider>)}
			<>
				{userDetail && showProfileTable && (
					<UserInfoTable
						name={userDetail?.name as string}
						address={userDetail?.address as string}
						city={userDetail?.city as string}
						postalCode={userDetail?.postalCode as string}
						phoneNumber={userDetail?.phoneNumber as string}
						image={userDetail?.image as string}
					/>
				)}
			</>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 md:gap-8 mt-10">
				{showPets && userDetail?.pets?.map((pet, i) => {
					return (
						<div key={pet.name} className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
							<div className="flex justify-center">
								<div className="rounded-lg shadow-lg bg-white max-w-md">
									<Image width={300} height={300} className="rounded-t-lg h-[300px] w-[300px] object-cover" src={pet.profileImage || `https://mdbootstrap.com/img/new/standard/nature/19${i}.jpg`} alt={`an image of a ${pet.breed} named ${pet.name}`} />
									<div className="p-6">
										<h2 className="text-gray-900 text-xl font-medium mb-2">{pet.name}</h2>
										<p className="text-gray-700 text-base mb-4">{pet.breed}</p>
										<p className="text-gray-600 font-bold text-xs">Vaccinated: {pet?.vaccinated === false ? "❌" : "✅"}</p>
										<div className="flex bg-white">
											<Link href={`/pet/${pet.id}`} className="mt-6 flex flex-col items-center justify-center w-12 h-12 mr-2 text-gray-900 transition-colors duration-150 bg-teal-600 rounded-full focus:shadow-outline hover:bg-teal-500">
												<svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
											</Link>
											<button name="delete-pet" onClick={() => handleDeletePet(pet.id, pet.name)} className="mt-6 ml-4 flex flex-col items-center justify-center w-12 h-12 mr-2 text-gray-900 transition-colors duration-150 bg-teal-600 rounded-full focus:shadow-outline hover:bg-teal-500">
												<svg className="w-5 h-5" fill="#fff" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
													<path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
												</svg>
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