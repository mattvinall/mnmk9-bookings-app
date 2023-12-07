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
import { LoadingSpinner } from "../../components/client/ui/LoadingSpinner";

const PetDetail: NextPage = () => {
	const [secret, setSecret] = useState<string>("");
	const [key, setKey] = useState<string>("");
	const [showPetDetails, setShowPetDetails] = useState<boolean>(true);
	const [showVaccinationRecords, setShowVaccinationRecords] = useState<boolean>(false);
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

	console.log("pet id used to call waiver API", petId);

	const { data: waiverByPetId } = trpc.waiver.byPetId.useQuery({ id: petId as string });
	console.log("waiverByPetId", waiverByPetId);

	const waiverFormSignedStatus = waiverByPetId && Object.keys(waiverByPetId).length > 0 ? true : false;
	console.log("waiverFormSigned boolean status", waiverFormSignedStatus);

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
	}

	const handleShowVaccinationRecords = () => {
		setShowPetDetails(false);
		setShowVaccinationRecords(true);
	}

	const handleShowBookings = () => {
		setShowPetDetails(false);
		setShowVaccinationRecords(false);
	}


	if (isLoading) return (
		<LoadingSpinner />
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
		<div className="container flex flex-col gap-8 py-8 px-8 lg:gap-12 lg:px-16 lg:py-16 max-w-8xl">
			<a className="flex justify-start text-left text-white font-bold text-2xl" href={`/profile/${ownerId}`}>Go Back</a>
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Pet <span className="text-[rgb(238,182,43)]">Details</span></h1>

			{/* Tabs */}
			<div className="text-md font-medium text-center text-gray-500 border-b border-gray-500 dark:text-gray-400 dark:border-gray-500">
				<ul className="w-auto flex flex-wrap">
					<li className="mr-2">
						<button onClick={handleShowPetDetails} className={`${showPetDetails === true ? "text-gray-100 !border-gray-100 border-b-2" : ""}  inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-100 hover:border-gray-100`}>Pet Details</button>
					</li>
					<li>
						<button onClick={handleShowVaccinationRecords} className={`${showVaccinationRecords === true ? "text-gray-100 !border-gray-100 border-b-2" : ""} inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-100 hover:border-gray-100`}>Vaccination Records</button>
					</li>
				</ul>
			</div>

			{/* content  */}
			<div className="flex flex-col flex-wrap lg:flex-row lg:justify-between lg:items-baseline">
				{showPetDetails && (
					<>
						{/* Pet Detail Card */}
						{petDetail && petDetail.length > 0 && petDetail.map((pet: Pet) => PetDetailCard(pet, waiverFormSignedStatus, defaultImage))}
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
			<div className="flex flex-col lg:flex-row lg:justify-between items-baseline">
				{showVaccinationRecords && (
					<>
						<div className="flex flex-col">
							{vaccinationRecords && vaccinationRecords.length > 0 ? vaccinationRecords.map((record: Vaccination) => VaccinationRecordCard(record, handleDeleteVaccinationRecord)) : <p className="text-white text-2xl font-medium w-2/3 mb-8"> No Vaccination Added.Please fill out the form to the right to add your pet&apos; vaccine records.</p>}
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
		</div >
	)
}

export default PetDetail;