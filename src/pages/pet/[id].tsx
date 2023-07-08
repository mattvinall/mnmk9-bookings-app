import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import useSetProfileImage from "../../hooks/useSetProfileImage";
import { Pet, Vaccination } from "@prisma/client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import EditPetForm from "../../components/client/forms/EditPetForm";
import { PetDetailCard } from "../../components/client/ui/PetDetailCard";
import VaccinationRecordCard from "../../components/client/ui/VaccinationRecordCard";
import AddVaccineForm from "../../components/client/forms/AddVaccineForm";
import { NextPage } from "next";

const PetDetail: NextPage = () => {
	const [secret, setSecret] = useState<string>("");
	const [key, setKey] = useState<string>("");
	const [showPetDetails, setShowPetDetails] = useState<boolean>(true);
	const [showVaccinationRecords, setShowVaccinationRecords] = useState<boolean>(false);
	const [showBookings, setShowBookings] = useState<boolean>(false);
	const router = useRouter();
	const id = router.query.id as string;
	const { data: petDetail, isLoading, error, refetch } = trpc.pet.vaccinationsByPetId.useQuery({ id });
	const deleteVaccinationRecord = trpc.vaccine.delete.useMutation();

	interface PetDetail extends Pet {
		vaccinations: Vaccination[];
	}

	// get values of name, id and vaccinated to use for later
	const name = petDetail?.map((pet: Pet) => pet.name as string)[0];
	const petId = petDetail?.map((pet: Pet) => pet.id as string)[0];
	const ownerId = petDetail?.map((pet: Pet) => pet.ownerId as string)[0];
	const vaccinationRecords = petDetail && petDetail?.map((pet: PetDetail) => pet?.vaccinations)[0] || [];

	useEffect(() => {
		const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;
		const secret = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET;

		if (!key) return;
		if (!secret) return;

		setKey(key);
		setSecret(secret);
	}, [key, secret]);

	const handleShowPetDetails = () => {
		setShowPetDetails(true);
		setShowVaccinationRecords(false);
		setShowBookings(false);
	}

	const handleShowVaccinationRecords = () => {
		setShowPetDetails(false);
		setShowVaccinationRecords(true);
		setShowBookings(false);
	}

	const handleShowBookings = () => {
		setShowPetDetails(false);
		setShowVaccinationRecords(false);
		setShowBookings(true);
	}


	if (isLoading) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Loading....</h1>
		</div>
	);

	if (error) return (
		<div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Please login to manage your pets profile..</h1>
		</div>
	);

	const defaultImage = `https://mdbootstrap.com/img/new/standard/nature/190.jpg`;

	const handleDeleteVaccinationRecord = (id: string) => {
		try {
			deleteVaccinationRecord.mutate({ id });
			refetch();
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="container flex flex-col gap-12 px-16 py-16 max-w-8xl">
			<a className="flex justify-start text-left text-white font-bold text-2xl" href={`/profile/${ownerId}`}>Go Back</a>
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Pet <span className="text-[rgb(103,163,161)]">Details</span></h1>

			{/* Tabs */}
			<div className="text-md font-medium text-center text-gray-500 border-b border-gray-500 dark:text-gray-400 dark:border-gray-500">
				<ul className="w-auto flex flex-wrap">
					<li className="mr-2">
						<button onClick={handleShowPetDetails} className={`${showPetDetails === true ? "text-gray-100 !border-gray-100 border-b-2" : ""}  inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-100 hover:border-gray-100`}>Pet Details</button>
					</li>
					<li>
						<button onClick={handleShowVaccinationRecords} className={`${showVaccinationRecords === true ? "text-gray-100 !border-gray-100 border-b-2" : ""} inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-100 hover:border-gray-100`}>Vaccination Records</button>
					</li>
					<li className="mr-2">
						<button onClick={handleShowBookings} className={`${showBookings === true ? "text-gray-100 !border-gray-100 border-b-2" : ""} inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-100 hover:border-gray-100`}>Bookings</button>
					</li>
				</ul>
			</div>

			{/* content  */}
			<div className="flex justify-between items-baseline">
				{showPetDetails && (
					<>
						{/* Pet Detail Card */}
						{petDetail && petDetail.length > 0 && petDetail.map((pet: Pet) => PetDetailCard(pet, defaultImage))}
						{/* Edit Pet Form */}
						{petId && key && petDetail && (
							<GoogleReCaptchaProvider reCaptchaKey={key}>
								<EditPetForm secret={secret} petId={petId} petDetails={petDetail || {}} />
							</GoogleReCaptchaProvider>
						)}
					</>
				)}
			</div>

			{/* Vaccination Records */}
			<div className="flex justify-between items-baseline">
				{showVaccinationRecords && (
					<>
						<div className="flex flex-col">
							{vaccinationRecords && vaccinationRecords.length > 0 && vaccinationRecords.map((record: Vaccination) => VaccinationRecordCard(record, handleDeleteVaccinationRecord))}
						</div>
						{/* Add Vaccination Record Form */}
						{petId && key && name && (
							<GoogleReCaptchaProvider reCaptchaKey={key}>
								<AddVaccineForm petId={petId} petName={name} secret={secret} refetch={refetch} />
							</GoogleReCaptchaProvider>
						)}
					</>
				)}
			</div>

			{/* Bookings */}
			{/*
					 Todo: 
					 - create vaccination card component with vaccine name, valid to date, maybe an image for the top of the card
					 - be able to filter by pet
				*/}

		</div >
	)
}

export default PetDetail;