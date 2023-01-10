import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const PetDetail = () => {
	const router = useRouter();
	const id = router.query.id as string;
	const { data: petDetail, isLoading, error } = trpc.pet.byId.useQuery({ id });

	console.log("pet detail", petDetail);

	if (isLoading) return <h1 className="gap-12 px-4 py-16 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
		Loading...
	</h1>

	if (error) return router.back();

	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2 md:gap-8 mt-10">
				{petDetail?.map((pet, i) => {
					return (
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
					)
				})}
			</div>
		</div>
	)

}

export default PetDetail
