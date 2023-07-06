import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { trpc } from "../../utils/trpc";
import useSetProfileImage from "../../hooks/useSetProfileImage";
import useSetVaccinationDocument from "../../hooks/useSetVaccinationDocument";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import Swal from "sweetalert2";
import { Pet } from "@prisma/client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import EditPetForm from "../../components/client/forms/EditPetForm";

const PetDetail = () => {
	const [secret, setSecret] = useState<string>("");
	const [key, setKey] = useState<string>("");

	const router = useRouter();
	const id = router.query.id as string;
	const { data: petDetail, isLoading, error, refetch } = trpc.pet.byId.useQuery({ id });

	// get values of name, id and vaccinated to use for later
	const name = petDetail?.map((pet: Pet) => pet.name as string)[0];
	const petId = petDetail?.map((pet: Pet) => pet.id as string)[0];
	const ownerId = petDetail?.map((pet: Pet) => pet.ownerId as string)[0];

	// const {
	// 	uploadedProfileImageUrl,
	// 	imageFileNamePreview,
	// 	handleProfileImageFileChange,
	// 	handleUploadProfileImage
	// } = useSetProfileImage(name as string);

	// const {
	// 	uploadedVaccinationDocumentUrl,
	// 	handleVaccinationDocumentFileChange,
	// } = useSetVaccinationDocument(name as string);

	// mutations to add profile image, vaccination document, delete document, and update vaccinated status

	// const uploadPetProfileImage = trpc.pet.addPetProfilePicture.useMutation({
	// 	onSuccess: () => refetch()
	// });
	// const uploadVaccinationDocument = trpc.vaccine.create.useMutation({
	// 	onSuccess: () => refetch()
	// });
	// const deleteVaccinationDocument = trpc.vaccine.delete.useMutation({
	// 	onSuccess: () => refetch()
	// });

	// once profile image has been updated, add to Pet DB tale by passing in the pet id and the image url from S3

	// useEffect(() => {
	// 	if (uploadedProfileImageUrl) {
	// 		uploadPetProfileImage.mutate({ id, profileImage: uploadedProfileImageUrl as string });
	// 	}
	// }, [uploadedProfileImageUrl])

	// if there is a vaccinated document url from S3, add to the Documents table by passing in the pet id and the file name

	// useEffect(() => {
	// 	if (uploadedVaccinationDocumentUrl && petId) {
	// 		uploadVaccinationDocument.mutate({
	// 			petId,
	// 			fileName: uploadedVaccinationDocumentUrl.split(".")[0] as string,
	// 			uploadedS3Url: uploadedVaccinationDocumentUrl,
	// 			validTo: new Date("2024-01-01"),
	// 			name: "Lepto Vaccine"
	// 		});
	// 	}
	// }, [uploadedVaccinationDocumentUrl]);

	useEffect(() => {
		const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;
		const secret = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET;

		if (!key) return;
		if (!secret) return;

		setKey(key);
		setSecret(secret);
	}, [key, secret]);

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

	return (
		<div className="container flex flex-col gap-12 px-16 py-16 max-w-8xl">
			<a className="flex justify-start text-left text-white font-bold text-2xl" href={`/profile/${ownerId}`}>Go Back</a>
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Pet <span className="text-[rgb(103,163,161)]">Details</span></h1>
			<div className="flex justify-between items-baseline">
				{petDetail?.map((pet, idx) => {
					const defaultImage = `https://mdbootstrap.com/img/new/standard/nature/19${idx + 1}.jpg`
					return (
						<div key={pet.id} className="flex justify-center">
							<div className="rounded-lg shadow-lg bg-white max-w-full w-[90%] md:w-[32rem]">
								<div className="p-6">
									<div className="flex justify-betweem items-center border-slate-600 border-b-2 pb-2">
										<h2 className="text-gray-900 text-3xl font-medium mb-2 w-3/4">{pet.name} - {pet.breed}</h2>
										<figure className="w-1/4 flex justify-end align-center">
											<img src={pet.profileImage ? pet.profileImage : defaultImage} alt="pet profile image" className="w-10 h-10 rounded-full border-2 border-gray-300" />
										</figure>
									</div>
									<div className="my-4 border-slate-500 border-b-2">
										<div className="mb-4">
											<p className="text-gray-600 font-medium text-lg">Sex: {pet.sex.toLowerCase()}</p>
										</div>
										<div className="mb-4">
											<p className="text-gray-600 font-medium text-lg">Age: {pet.age} years old</p>
										</div>
										<div className="mb-4">
											<p className="text-gray-600 font-medium text-lg">Weight: {pet.weight} lbs</p>
										</div>
										<div className="mb-4">
											<p className="text-gray-600 font-medium text-lg">Temperament: {pet.temperament.toLocaleLowerCase()}</p>
										</div>
									</div>
									<div className="flex flex-col md:flex-row justify-between items-center border-slate-500 border-b-2">
										<div className="mb-4">
											<p className="text-gray-600 font-medium text-lg">{pet?.sex === "MALE" ? "Neutered: " : "Spayed: "}  <span className="inline-block ml-2">{pet?.ovariohysterectomy === false ? "❌" : "✅"}</span></p>
										</div>
										<div className="mb-4">
										</div>
										{/* <p className="text-gray-600 font-medium text-lg">}</span></p> */}
									</div>
									<div className="my-4">
										{pet?.medicalNotes && (
											<p className="text-gray-600 font-medium text-lg">Medical Notes: {pet.medicalNotes}</p>
										)}
									</div>
									<div className="my-4 border-slate-500 border-b-2 pb-4">
										{pet?.feedingNotes && (
											<p className="text-gray-600 font-medium text-lg">Feeding Notes: <br /> {pet.feedingNotes}</p>
										)}
									</div>
									{pet?.microchipNumber && (
										<div className="mt-8 flex justify-center items-end">
											<p className="min-h-[50px] text-gray-600 font-medium text-sm">Microchip #: {pet.microchipNumber}</p>
										</div>
									)}
								</div>
							</div>
						</div>
					)
				})}
				{petId && key && petDetail && (
					<GoogleReCaptchaProvider reCaptchaKey={key}>
						<EditPetForm secret={secret} petId={petId} petDetails={petDetail || {}} />
					</GoogleReCaptchaProvider>
				)}
			</div>
		</div >
	)
}

export default PetDetail;