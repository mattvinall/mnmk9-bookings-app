import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserDetailForm from "../../components/UserDetailForm";
import { trpc } from "../../utils/trpc";

const UserDetail: () => void = () => {
	const router = useRouter();
	const userId = router.query.id as string;
	const { data: userDetail, isLoading, error } = trpc.user.byId.useQuery({ id: userId });

	console.log("user detail", userDetail);

	const [showForm, setShowForm] = useState<Boolean>(false);
	const [showModal, setShowModal] = useState<Boolean>(false);

	const handleShowForm = () => {
		setShowForm((prev) => !prev);
	}

	const handleShowModal = () => {
		setShowModal((prev) => !prev);
	}

	if (isLoading) return <h1 className="gap-12 px-4 py-16 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
		Loading...
	</h1>

	if (error) return router.back();

	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
				Manage  <span className="text-[hsl(280,100%,70%)]">Profile</span>
			</h1>
			<p className="text-white text-center w-[80%] font-bold sm:text-[2.5rem]">
				Manage Profile or Add Pets to your Profile
			</p>
			<div className="flex justify-center">
				<button onClick={handleShowForm} className="mt-[25px] mx-6 rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Manage Profile</button>
				<button onClick={handleShowModal} className="mt-[25px] mx-6 rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Add Pet(s)</button>
			</div>
			<>{showForm && (<UserDetailForm setShowForm={setShowForm} />)}</>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2 md:gap-8 my-20">
				{userDetail?.pets?.map((pet, i) => {
					return (
						<a className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20" href={`/pet/${pet.name}`}>
							<div className="flex justify-center">
								<div className="rounded-lg shadow-lg bg-white max-w-md">
									<img className="rounded-t-lg" src={`https://mdbootstrap.com/img/new/standard/nature/18${i}.jpg`} alt="" />
									<div className="p-6">
										<h2 className="text-gray-900 text-xl font-medium mb-2">{pet.name}</h2>
										<p className="text-gray-700 text-base mb-4">{pet.breed}</p>
										<p className="text-gray-600 font-bold text-xs">Vaccinated: {pet?.vaccinated === false ? "No" : "Yes"}</p>
									</div>
								</div>
							</div>
						</a >
					)
				})}
			</div >
		</div >
	)
}

export default UserDetail;