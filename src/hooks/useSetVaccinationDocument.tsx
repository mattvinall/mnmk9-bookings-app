import { useState } from "react";
import { S3 } from 'aws-sdk';
import Swal from "sweetalert2";

const useSetVaccinationDocument = (name: any) => {
	const [vaccinationDocument, setVaccinationDocument] = useState({});
	const [uploadedVaccinationDocumentUrl, setUploadedVaccinationDocumentUrl] = useState("");
	const [fileName, setFileName] = useState("");

	interface File {
		lastModified: number,
		name: string,
		lastModidiedDate: Date,
		size: number,
		type: string,
		webkitRelativePath: string,
	}

	const handleUploadVaccinationDocuments = (file: File, e: SubmitEvent) => {
		e.preventDefault();

		console.log("file", file);
		// Instantiate an S3 client
		const s3 = new S3({
			accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
		});

		if (file) {
			console.log("file not null", file);
			setVaccinationDocument(file);
			// 	// Upload the file to S3
			const params = {
				Bucket: `mnmk9-bookings/documents/${name}`,
				Key: fileName,
				Body: file,
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

				console.log("data from upload document", data);
				// set url of file to state
				setUploadedVaccinationDocumentUrl(data.Location);
			})
		}

	};

	const handleVaccinationDocumentFileChange = (event: any) => {
		const chosenFile = event.currentTarget.files[0];
		const fileName = chosenFile && chosenFile.name;
		fileName && setFileName(fileName)
		console.log("file name", fileName);
		handleUploadVaccinationDocuments(chosenFile, event);
	}

	return {
		uploadedVaccinationDocumentUrl,
		handleVaccinationDocumentFileChange,
		fileName
	}
}

export default useSetVaccinationDocument;