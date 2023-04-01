import { ses } from "../server/aws/ses/index";
import { formatTime } from "../utils/formatTime";

export const sendEmailToAdmin = async (
	emailTo: string,
	emailFrom: string,
	firstName: string,
	lastName: string,
	email: string,
	phoneNumber: string,
	petName: string,
	checkInDate: string,
	checkOutDate: string,
	startTime: string,
	endTime: string,
	serviceName: string,
	notes?: string,
) => {
	const formattedCheckInDate = checkInDate ? new Date(checkInDate).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}) : '';
	const formattedCheckOutDate = checkOutDate ? new Date(checkOutDate).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}) : '';
	const htmlTemplate = `
	<html>
		<body style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
			<h1 style="text-align: center; font-size: 24px;">Booking Details |  ${serviceName}</h1>
			<div style="border: 1px solid #ccc; padding: 20px;">
				<p style="font-size: 18px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
				<p style="font-size: 18px;"><strong>Email:</strong> ${email}</p>
				<p style="font-size: 18px;"><strong>Phone Number:</strong> ${phoneNumber}</p>
				<p style="font-size: 18px;"><strong>Pet Name:</strong> ${petName}</p>
				<p style="font-size: 18px;"><strong>Check-In Date:</strong> ${formattedCheckInDate}</p>
				<p style="font-size: 18px;"><strong>Check-Out Date:</strong> ${formattedCheckOutDate}</p>
				<p style="font-size: 18px;"><strong>Drop Off Time:</strong> ${formatTime(startTime)}</p>
				<p style="font-size: 18px;"><strong>Pick Up Time:</strong> ${formatTime(endTime)}</p>
				<p style="font-size: 18px;"><strong>Notes:</strong> ${notes}</p>
			</div>
			
		</body>
	</html>
`
	const emailParams = {
		Destination: {
			ToAddresses: [emailTo]
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: htmlTemplate
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `Booking for ${serviceName}: ${firstName} ${lastName} | Pet: ${petName}`
			}
		},
		Source: emailFrom
	}

	return await ses.sendEmail(emailParams).promise();
}

export const sendEmailToClient = async (
	emailTo: string,
	emailFrom: string,
	petName: string,
	checkInDate: string,
	startTime: string,
	endTime: string,
	serviceName: string,
	checkOutDate?: string,
	notes?: string,
) => {
	const formattedCheckInDate = checkInDate ? new Date(checkInDate).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}) : '';
	const formattedCheckOutDate = checkOutDate ? new Date(checkOutDate).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}) : '';
	const htmlTemplate = `
	<html>
		<head>
			<meta charset="utf-8">
			<title>Booking Confirmation</title>
			<style>
				/* Branding colors */
				body {
					background-color: #f2f2f2;
				}
				h1, h2 {
					color: #333;
				}
				p {
					color: #666;
				}
				.blue {
					color: #0071c5;
				}
				.black {
					color: #000;
				}
				.grey {
					color: #999;
					font-size: 16px;
				}

				/* Email template styles */
				.container {
					max-width: 600px;
					margin: auto;
					padding: 20px;
					font-family: Arial, sans-serif;
				}
				.logo {
					text-align: left;
					margin-bottom: 20px;
				}
				.logo img {
					max-width: 150px;
				}
				.booking-details {
					margin-bottom: 30px;
				}
				.booking-details p {
					margin: 0;
					padding: 5px 0;
					font-size: 16px;
				}
				.booking-details .label {
					font-weight: bold;
				}
				.waiver-message {
					margin-top: 30px;
					font-style: italic;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<div class="logo">
					<img src="https://mnmk9-bookings.s3.ca-central-1.amazonaws.com/images/logo/mnmk9-logo.jpg" alt="MNMK-9 Company Logo">
				</div>
				<h1 class="blue">Thank you for booking with MNMK-9</h1>
				<div class="booking-details">
					<p><span class="label black">Service Booked:</span> <span class="blue">${serviceName}</span></p>
					<p><span class="label black">Pet Name:</span> <span class="blue">${petName}</span></p>
					<p><span class="label black">Check In Date:</span> <span class="blue">${formattedCheckInDate}</span></p>
					<p><span class="label black">Check Out Date:</span> <span class="blue">${formattedCheckOutDate}</span></p>
					<p><span class="label black">Start Time/Drop Off Time:</span> <span class="blue">${formatTime(startTime)}</span></p>
					<p><span class="label black">End Time/Pick Up Time:</span> <span class="blue">${formatTime(endTime)}</span></p>
					<p><span class="label black">Notes:</span> <span class="blue">${notes}</span></p>
				</div>
				<p class="grey"><b>If you have not added your waiver form to your profile, you can do so via the <a style="color: #122748; font-weight: bold; font-size: inherit;" href="https://mnmk9-bookings.vercel.app/" target="_blank" rel="noopener">MNMK-9 Bookings App</a>.</b></p>
				<p class="waiver-message grey"><b>Note: All pets require a waiver form to be on file prior to any service. Once the waiver is uploaded, the MNMK-9 team can confirm your booking.</b></p>
			</div>
		</body>
	</html>
`
	const emailParams = {
		Destination: {
			ToAddresses: [emailTo]
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: htmlTemplate
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `MNMK-9 ${serviceName} Booking Details | ${petName}`
			}
		},
		Source: emailFrom
	}

	return await ses.sendEmail(emailParams).promise();
}


export const sendEmailContactForm = async (
	emailTo: string,
	emailFrom: string,
	name: string,
	message: string
) => {
	const date = new Date();
	const dateString = date.toLocaleDateString();
	const timeString = date.toLocaleTimeString();
	const htmlTemplate = `
	<html>
		<body style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
			<h1 style="text-align: center; font-size: 24px;">Contact Form Request</h1>
			<div style="border: 1px solid #ccc; padding: 20px;">
				<p style="font-size: 18px;"><strong>Name:</strong> ${name}</p>
				<p style="font-size: 18px;"><strong>Email:</strong> ${emailTo}</p>
				<p style="font-size: 18px;"><strong>Message:</strong> ${message}</p>
				<p style="font-size: 18px;"><strong>Date | Time:</strong> ${dateString + "|" + timeString}</p>
			</div>
		</body>
	</html>
`
	const emailParams = {
		Destination: {
			ToAddresses: [emailTo]
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: htmlTemplate
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `MNMK-9 Contact Form Request`
			}
		},
		Source: emailFrom
	}

	return await ses.sendEmail(emailParams).promise();
}