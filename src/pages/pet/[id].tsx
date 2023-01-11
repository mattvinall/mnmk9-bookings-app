import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { S3 } from 'aws-sdk';

const PetDetail = () => {
	const router = useRouter();

	const id = router.query.id as string;
	const { data: petDetail, isLoading, error, refetch } = trpc.pet.byId.useQuery({ id });
	console.log("pet detail: ", petDetail)

	const [vaccinationDocuments, setVaccinationDocuments] = useState([]);
	const [file, setFile] = useState(null);
	const [uploadedProfileImageUrl, setUploadedProfileImageUrl] = useState(null)
	const [uploadedVaccinationDocumentUrl, setUploadedVaccinationDocumentUrl] = useState(null)

	const handleProfileImageFileChange = (e: any) => {
		const imageFile = e.target.files[0];
		imageFile && setFile(imageFile);
		console.log("file state", file)
	};

	const handleUploadProfileImage = (e: SubmitEvent) => {
		e.preventDefault();

		// Instantiate an S3 client
		const s3 = new S3({
			accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
		});

		if (file) {
			console.log("file not null", file);
			// Upload the file to S3
			const params = {
				Bucket: 'mnmk9-bookings/images',
				Key: file.name,
				Body: file,
				// ACL: ' public-read-write',
			}
			s3.upload(params, (err: any, data: any) => {
				if (data) {
					console.log("data", data)
					setUploadedProfileImageUrl(data.Location);
				}

				console.log("err", err);
			})
		}
	};

	const handleUploadVaccinationDocuments = (files: any, e: SubmitEvent) => {
		e.preventDefault();

		console.log("files", files);
		const uploadedVaccinationDocuments = [...vaccinationDocuments];

		files?.some((file: any) => {
			if (uploadedVaccinationDocuments && uploadedVaccinationDocuments.findIndex((f) => f.name === file.name) === -1) {
				file && uploadedVaccinationDocuments.push(file);
				setVaccinationDocuments(uploadedVaccinationDocuments);
			}
		})
		// Instantiate an S3 client
		const s3 = new S3({
			accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
		});

		if (files && files.length === 1) {
			// 	// Upload the file to S3
			const params = {
				Bucket: 'mnmk9-bookings/documents',
				Key: files[0].name,
				Body: files[0],
				// ACL: ' public-read-write',
			}
			s3.upload(params, (err: any, data: any) => {
				if (data) {
					console.log("data", data)
					setUploadedVaccinationDocumentUrl(data.Location);
				}
				// add error handling
				console.log("err", err);
			})
		}
	};

	const handleVaccinationDocumentFileChange = (event: any) => {
		const chosenFiles = Array.from(event.target.files);
		console.log("chosenFiles", chosenFiles);
		handleUploadVaccinationDocuments(chosenFiles, event);
	}


	const uploadPetProfileImage = trpc.pet.addPetProfilePicture.useMutation();
	const uploadVaccinationDocument = trpc.documents.addVaccinationDocument.useMutation();

	useEffect(() => {
		if (uploadedProfileImageUrl) {
			uploadPetProfileImage.mutate({ id, profileImage: uploadedProfileImageUrl as string });
		}

		// after 1 second, refetch from DB
		setTimeout(() => {
			refetch();
		}, 1000);
	}, [uploadedProfileImageUrl])

	useEffect(() => {
		if (uploadedVaccinationDocumentUrl) {
			uploadVaccinationDocument.mutate({ petId: id, fileName: uploadedVaccinationDocumentUrl as string })
		}

		setTimeout(() => {
			refetch();
		}, 1000);
	}, [uploadedVaccinationDocumentUrl])
	if (isLoading) return <h1 className="gap-12 px-4 py-16 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
		Loading...
	</h1>

	if (error) return router.back();

	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 max-w-8xl">
			<div className="m-auto">
				{petDetail?.map((pet, i) => {
					return (
						<div key={pet?.id} className="flex justify-center">
							<div className="rounded-lg shadow-lg bg-white max-w-full w-[32rem]">

								<img className="w-full rounded-t-lg" style={{ height: "350px" }} src={pet.profileImage || uploadedProfileImageUrl || `https://mdbootstrap.com/img/new/standard/nature/18${i}.jpg`} width="50" alt={pet.name} />
								<div className="p-6">
									<h2 className="text-gray-900 text-xl font-medium mb-2">{pet.name}</h2>
									<p className="text-gray-700 text-base mb-4">{pet.breed}</p>
									<p className="text-gray-600 font-bold text-xs">Vaccinated: {pet?.vaccinated === false ? "No" : "Yes"}</p>
									<form className="mt-6">
										<label style={{ cursor: "pointer" }} htmlFor="pet-profile-image" className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
											Select Pet Profile Image
											<input
												style={{ cursor: "pointer" }}
												type="file"
												accept="image/*"
												id="pet-profile-image"
												className="hidden"
												onChange={handleProfileImageFileChange}
											/>
										</label>
										<button className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2" onClick={handleUploadProfileImage}>Upload Profile Image</button>
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
									{/* {pet.documents &&pet?.documents?.map(doc => {
										<a href={doc.fileName}>

										</a>
									})} */}
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</div >
	)

}

export default PetDetail
