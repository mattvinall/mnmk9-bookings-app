import { useState } from "react";
import Swal from "sweetalert2";
import { S3 } from 'aws-sdk';

const useSetProfileImage = (name: any) => {
	const [file, setFile] = useState({});
	const [uploadedProfileImageUrl, setUploadedProfileImageUrl] = useState("")
	const [imageFileNamePreview, setImageFileNamePreview] = useState("");

	const handleProfileImageFileChange = (e: any) => {
		const imageFile = e.currentTarget.files && e.currentTarget.files[0];
		console.log("image file: ", imageFile)
		imageFile && setImageFileNamePreview(imageFile?.name)
		imageFile && setFile(imageFile);
		console.log("file state", file)
	};

	const handleUploadProfileImage = (e: any) => {
		e.preventDefault();

		// Instantiate an S3 client
		const s3 = new S3({
			accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
		});

		if (file && imageFileNamePreview) {
			// Upload the file to S3
			const params = {
				Bucket: `mnmk9-bookings/images/${name}`,
				Key: imageFileNamePreview,
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

				setUploadedProfileImageUrl(data.Location);
				setImageFileNamePreview("");
			})
		}
	};

	return {
		uploadedProfileImageUrl,
		imageFileNamePreview,
		handleProfileImageFileChange,
		handleUploadProfileImage
	}
}

export default useSetProfileImage;