import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import useSetProfileImage from "../../hooks/useSetProfileImage";
import useSetVaccinationDocument from "../../hooks/useSetVaccinationDocument";

const PetDetail = () => {
	const router = useRouter();
	const id = router.query.id as string;
	const { data: petDetail, isLoading, error, refetch } = trpc.pet.byId.useQuery({ id });
	console.log("pet detail: ", petDetail)

	// get values of name, id and vaccinated to use for later
	const name = petDetail?.map(pet => pet.name as string);
	const petId = petDetail?.map(pet => pet.id as string)[0];
	const vaccinated = petDetail?.map(pet => pet.vaccinated)[0];
	const ownerId = petDetail?.map(pet => pet.ownerId as string)[0];

	const {
		uploadedProfileImageUrl,
		imageFileNamePreview,
		handleProfileImageFileChange,
		handleUploadProfileImage
	} = useSetProfileImage(name);

	const {
		uploadedVaccinationDocumentUrl,
		handleVaccinationDocumentFileChange,
	} = useSetVaccinationDocument(name);

	// mutations to add profile image, vaccination document, delete document, and update vaccinated status
	const uploadPetProfileImage = trpc.pet.addPetProfilePicture.useMutation({
		onSuccess: () => refetch()
	});
	const uploadVaccinationDocument = trpc.documents.addVaccinationDocument.useMutation({
		onSuccess: () => refetch()
	});
	const deleteVaccinationDocument = trpc.documents.deleteVaccinationDocument.useMutation({
		onSuccess: () => refetch()
	});
	const updateVaccinatedStaus = trpc.pet.updateVaccinatedStatus.useMutation({
		onSuccess: () => refetch()
	});

	// once profile image has been updated, add to Pet DB tale by passing in the pet id and the image url from S3
	useEffect(() => {
		if (uploadedProfileImageUrl) {
			uploadPetProfileImage.mutate({ id, profileImage: uploadedProfileImageUrl as string });
		}
	}, [uploadedProfileImageUrl])

	// if there is a vaccinated document url from S3, add to the Documents table by passing in the pet id and the file name
	useEffect(() => {
		if (uploadedVaccinationDocumentUrl) {
			uploadVaccinationDocument.mutate({ petId: id, fileName: uploadedVaccinationDocumentUrl as string })
		}

		// if pet is not vaccinated and uploaded a document, update status to true/yes
		if (petId && vaccinated === false) {
			updateVaccinatedStaus.mutate({ id: petId, vaccinated })
		}
	}, [uploadedVaccinationDocumentUrl]);


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
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 max-w-8xl">
			<a className="flex justify-start text-left text-white font-bold text-2xl" href={`/profile/${ownerId}`}>Go Back</a>
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Pet <span className="text-[hsl(280,100%,70%)]">Details</span></h1>
			<div className="m-auto">
				{petDetail?.map((pet, i) => {
					return (
						<div key={pet.id} className="flex justify-center">
							<div className="rounded-lg shadow-lg bg-white max-w-full w-[300px] md:w-[32rem]">
								<img className="w-[auto] md:w-full rounded-t-lg" style={{ height: "auto" }} src={pet.profileImage || uploadedProfileImageUrl || `https://mdbootstrap.com/img/new/standard/nature/18${i}.jpg`} width="50" alt={pet.name} />
								<div className="p-6">
									<h2 className="text-gray-900 text-xl font-medium mb-2">{pet.name}</h2>
									<p className="text-gray-700 text-base mb-4">{pet.breed}</p>
									<p className="text-gray-600 font-bold text-xs">Vaccinated: {pet?.vaccinated === false ? "No" : "Yes"}</p>
									<form className="mt-6">
										<label style={{ cursor: "pointer" }} htmlFor="pet-profile-image" className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-5">
											Select Profile Image to Upload
											<input
												style={{ cursor: "pointer" }}
												type="file"
												accept="image/*"
												id="pet-profile-image"
												className="hidden"
												onChange={handleProfileImageFileChange}
											/>
										</label>
										{imageFileNamePreview ? (<button className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2" onClick={handleUploadProfileImage}>Upload Selected Profile Image</button>) : null}
										<label style={{ cursor: "pointer" }} htmlFor="vaccination-documents" className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
											Upload Vaccination Document
											<input
												style={{ cursor: "pointer" }}
												type="file"
												multiple
												accept=".pdf"
												id="vaccination-documents"
												className="hidden"
												onChange={handleVaccinationDocumentFileChange}
											/>
										</label>
									</form>
									{imageFileNamePreview && <p className="font-medium">Image Selected: {imageFileNamePreview}. <br />Click Upload to set this image.</p>}
									{pet?.documents && pet?.documents.length > 0 && <h2 className="text-gray-900 text-xl font-medium mb-2 mt-6">Documents</h2>}
									{pet?.documents && pet?.documents.length > 0 && <p className="pb-8 text-sm text-grey-100">*your vaccination document will not upload again if you have the same file name. If you have a revised version, delete the existing one and re-upload the file again.</p>}
									{pet.documents?.map(doc => {
										// definte file name based on position in the array of the file name in S3
										const fileName = doc.fileName.split("/")[5];
										// split the array by perdiod and return the first item in the array --> ["murphy-vaccination", ".pdf"]
										const formattedName = fileName && fileName?.split(".")[0]?.replace(/%20/g, " ");
										return (
											<div key={doc.id} style={{ position: "relative" }}>
												<svg onClick={() => deleteVaccinationDocument.mutate({ id: doc.id })} className="w-6 h-6" fill="#fff" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer", position: "absolute", right: "0px", top: "35%" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
												<a className="flex items-center" href={doc.fileName} target="_blank" rel="noreferrer">
													<svg className="w-[80px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
														<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
													</svg>
													{formattedName}
												</a>
											</div>
										)
									})}
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