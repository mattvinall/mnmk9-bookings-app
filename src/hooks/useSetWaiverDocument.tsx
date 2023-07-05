import { useState } from "react";
import { S3 } from 'aws-sdk';
import Swal from "sweetalert2";

const useSetWaiverDocument = (name: string) => {
	const [waiverDocument, setWaiverDocument] = useState({});
	const [uploadedWaiverDocumentUrl, setUploadedWaiverDocumentUrl] = useState<string>("");
	const [fileName, setFileName] = useState<string>("");

	interface File {
		lastModified: number,
		name: string,
		lastModidiedDate: Date,
		size: number,
		type: string,
		webkitRelativePath: string,
	}

	const handleUploadWaiverDocuments = (file: File, e: SubmitEvent) => {
		e.preventDefault();

		console.log("file", file);
		// Instantiate an S3 client
		const s3 = new S3({
			accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
		});

		if (file) {
			setWaiverDocument(file);
			// 	// Upload the file to S3
			const params = {
				Bucket: `mnmk9-bookings/documents/waiver/${name}`,
				Key: file.name,
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
				// set url of file to state
				setUploadedWaiverDocumentUrl(data.Location);
			})
		}
	};

	const handleWaiverDocumentFileChange = (event: any) => {
		const chosenFile = event.currentTarget.files[0];
		const fileName = chosenFile && chosenFile.name as string;
		fileName && setFileName(fileName)
		console.log("file name", fileName);
		handleUploadWaiverDocuments(chosenFile, event);
	}

	return {
		uploadedWaiverDocumentUrl,
		handleWaiverDocumentFileChange,
		waiverDocument,
		fileName,
		setFileName
	}
}

export default useSetWaiverDocument;