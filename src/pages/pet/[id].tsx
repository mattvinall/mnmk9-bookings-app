import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { trpc } from "../../utils/trpc";
import { S3 } from 'aws-sdk';
import Swal from "sweetalert2";

const PetDetail = () => {
	const router = useRouter();

	const id = router.query.id as string;
	const { data: petDetail, isLoading, error, refetch } = trpc.pet.byId.useQuery({ id });
	console.log("pet detail: ", petDetail)

	const [vaccinationDocuments, setVaccinationDocuments] = useState([]);
	const [file, setFile] = useState(null);
	const [uploadedProfileImageUrl, setUploadedProfileImageUrl] = useState(null)
	const [uploadedVaccinationDocumentUrl, setUploadedVaccinationDocumentUrl] = useState(null);
	const [imageFileNamePreview, setImageFileNamePreview] = useState(null);

	const handleProfileImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const imageFile = e.currentTarget.files && e.currentTarget.files[0];
		console.log("image file: ", imageFile)
		imageFile && setImageFileNamePreview(imageFile?.name)
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
			s3.upload(params, (error: any, data: any) => {
				// throw error popup if upload failed
				if (error) {
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: `Something went wrong uploading your pets profile image! ${error}`,
					});
				}

				setUploadedProfileImageUrl(data.Location);
				setImageFileNamePreview(null);
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
			s3.upload(params, (error: any, data: any) => {
				// throw error popup if upload failed
				if (error) {
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: `Something went wrong uploading your pets profile image! ${error}`,
					});
				}
				// set url of file to state
				setUploadedVaccinationDocumentUrl(data.Location);
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
	const deleteVaccinationDocument = trpc.documents.deleteVaccinationDocument.useMutation();

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
	}, [uploadedVaccinationDocumentUrl]);

	useEffect(() => {
		if (deleteVaccinationDocument.data) {
			refetch();
		}
	}, [deleteVaccinationDocument]);

	if (isLoading) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Loading....</h1>
		</div>
	);

	if (error) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Error....please contact support</h1>
		</div>
	)

	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 max-w-8xl">
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Pet <span className="text-[hsl(280,100%,70%)]">Details</span></h1>
			<div className="m-auto">
				{petDetail?.map((pet, i) => {
					return (
						<div key={pet?.id} className="flex justify-center">
							<div className="rounded-lg shadow-lg bg-white max-w-full w-[32rem]">

								<Image className="w-full rounded-t-lg" style={{ height: "350px" }} src={pet.profileImage || uploadedProfileImageUrl || `https://mdbootstrap.com/img/new/standard/nature/18${i}.jpg`} width="50" alt={pet.name} />
								<div className="p-6">
									<h2 className="text-gray-900 text-xl font-medium mb-2">{pet.name}</h2>
									<p className="text-gray-700 text-base mb-4">{pet.breed}</p>
									<p className="text-gray-600 font-bold text-xs">Vaccinated: {pet?.vaccinated === false ? "No" : "Yes"}</p>
									<form className="mt-6">
										<label style={{ cursor: "pointer" }} htmlFor="pet-profile-image" className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-5">
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
									{imageFileNamePreview && <p>Image Selected: {imageFileNamePreview}</p>}
									{pet?.documents && pet?.documents.length > 0 && <h2 className="text-gray-900 text-xl font-medium mb-2 mt-6">Documents</h2>}
									{pet?.documents?.map(doc => {
										const fileName = doc.fileName.split("/")[4];
										const formattedName = fileName && fileName.split(".")[0];
										console.log("file name in map: ", fileName)
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
		</div >
	)

}

export default PetDetail
