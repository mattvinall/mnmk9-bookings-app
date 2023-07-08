import { useState } from "react";
import { S3 } from 'aws-sdk';
import Swal from "sweetalert2";

const useUploadFileToS3 = (name: string, fileType: string) => {
	const [uploadedS3Url, setUploadedS3Url] = useState("");
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
			const params = {
				Bucket: `mnmk9-bookings/documents/${fileType}/${name}`,
				Key: file.name,
				Body: file,
			}

			s3.upload(params, (error: Error, data: S3.ManagedUpload.SendData) => {
				console.log("data when uploading", data);
				// throw error popup if upload failed
				if (error) {
					console.log("error when uploading", error);
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: `Something went wrong uploading your pets vaccination document! ${error}`,
					});
				}
				// set url of file to state
				setUploadedS3Url(data.Location as string);
			})
		}
	};

	const handleDocumentFileChange = (event: any) => {
		const chosenFile = event.currentTarget.files[0];
		const fileName = chosenFile && chosenFile.name;
		fileName && setFileName(fileName)
		console.log("file name", fileName as string);
		handleUploadVaccinationDocuments(chosenFile, event);
	}

	return {
		uploadedS3Url,
		handleDocumentFileChange,
		fileName,
	}
}

export default useUploadFileToS3