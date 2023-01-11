import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { S3 } from 'aws-sdk';

const PetDetail = () => {
	const router = useRouter();

	const id = router.query.id as string;
	const { data: petDetail, isLoading, error, refetch } = trpc.pet.byId.useQuery({ id });
	const petImageURL = petDetail?.map(pet => pet.profileImage)[0];

	// const [newVaccinationDocuments, setNewVaccinationDocuments] = useState([]);

	const [file, setFile] = useState(null);
	const [uploadedUrl, setUploadedUrl] = useState(null);

	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		file && setFile(file);
		console.log("file state", file)
	};

	const handleUpload = (event: SubmitEvent) => {
		event.preventDefault();
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
					setUploadedUrl(data.Location);
				}

				console.log("err", err);
			})
		}

		refetch();
	};

	const uploadPetProfileImage = trpc.pet.addPetProfilePicture.useMutation();

	useEffect(() => {
		if (uploadedUrl) {
			uploadPetProfileImage.mutate({ id, profileImage: uploadedUrl as string })
		}

		refetch()
	}, [])

	if (isLoading) return <h1 className="gap-12 px-4 py-16 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
		Loading...
	</h1>

	if (error) return router.back();

	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-1 md:grid-cols-2 md:gap-8 mt-10">
				{petDetail?.map((pet, i) => {
					return (
						<div key={pet?.id} className="flex justify-center">
							<div className="rounded-lg shadow-lg bg-white">

								<img className="w-full rounded-t-lg" style={{ height: "350px" }} src={petImageURL || uploadedUrl || `https://mdbootstrap.com/img/new/standard/nature/185.jpg`} width="50" alt={pet.name} />
								<div className="p-6">
									<h2 className="text-gray-900 text-xl font-medium mb-2">{pet.name}</h2>
									<p className="text-gray-700 text-base mb-4">{pet.breed}</p>
									<p className="text-gray-600 font-bold text-xs">Vaccinated: {pet?.vaccinated === false ? "No" : "Yes"}</p>
									<form className="mt-6" onSubmit={handleUpload}>
										{/* <label htmlFor="vaccination-documents" className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
											Upload Vaccination Documents
										</label>
										<input
											style={{ cursor: "pointer" }}
											type="file"
											multiple
											accept=".pdf"
											id="vaccination-documents"
											className="hidden"
											onChange={handleVaccinationDocumentUpload}
										/> */}
										<label style={{ cursor: "pointer" }} htmlFor="pet-profile-image" className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
											Upload Pet Profile Image
											<input
												style={{ cursor: "pointer" }}
												type="file"
												accept="image/*"
												id="pet-profile-image"
												className="hidden"
												onChange={handleFileChange}
											/>
										</label>
										<button className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2" type="submit">Upload</button>
									</form>
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
