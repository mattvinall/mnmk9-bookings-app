import { ses } from "../server/aws/ses/index";

export const sendEmailDaycare = async (
	emailTo: Array<string>,
	emailFrom: string,
	firstName: string,
	lastName: string,
	email: string,
	phoneNumber: string,
	petName: string,
	checkInDate: string,
	startTime: string,
	endTime: string,
	notes?: string,
) => {
	const htmlTemplate = `
	<html>
		<body style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
			<h1 style="text-align: center; font-size: 24px;">Booking Details</h1>
			<div style="border: 1px solid #ccc; padding: 20px;">
				<p style="font-size: 18px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
				<p style="font-size: 18px;"><strong>Email:</strong> ${email}</p>
				<p style="font-size: 18px;"><strong>Phone Number:</strong> ${phoneNumber}</p>
				<p style="font-size: 18px;"><strong>Pet Name:</strong> ${petName}</p>
				<p style="font-size: 18px;"><strong>Check-In Date:</strong> ${checkInDate}</p>
				<p style="font-size: 18px;"><strong>Drop Off Time:</strong> ${startTime}</p>
				<p style="font-size: 18px;"><strong>Pick Up Time:</strong> ${endTime}</p>
				<p style="font-size: 18px;"><strong>Notes:</strong> ${notes}</p>
			</div>
		</body>
	</html>
`
	const emailParams = {
		Destination: {
			ToAddresses: emailTo
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
				Data: `Booking for Daycare: ${firstName} ${lastName} | Pet: ${petName}`
			}
		},
		Source: emailFrom
	}

	return await ses.sendEmail(emailParams).promise();
}

export const sendEmailBoarding = async (
	emailTo: Array<string>,
	emailFrom: string,
	firstName: string,
	lastName: string,
	email: string,
	phoneNumber: string,
	petName: string,
	checkInDate: string,
	checkOutDate: string,
	notes?: string,
) => {
	const htmlTemplate = `
	<html>
		<body style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
			<h1 style="text-align: center; font-size: 24px;">Booking Details</h1>
			<div style="border: 1px solid #ccc; padding: 20px;">
				<p style="font-size: 18px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
				<p style="font-size: 18px;"><strong>Email:</strong> ${email}</p>
				<p style="font-size: 18px;"><strong>Phone Number:</strong> ${phoneNumber}</p>
				<p style="font-size: 18px;"><strong>Pet Name:</strong> ${petName}</p>
				<p style="font-size: 18px;"><strong>Check-In Date:</strong> ${checkInDate}</p>
				<p style="font-size: 18px;"><strong>Check-Out Date:</strong> ${checkOutDate}</p>
				<p style="font-size: 18px;"><strong>Notes:</strong> ${notes}</p>
			</div>
		</body>
	</html>
`
	const emailParams = {
		Destination: {
			ToAddresses: emailTo
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
				Data: `Booking for Boarding: ${firstName} ${lastName} | Pet: ${petName}`
			}
		},
		Source: emailFrom
	}

	return await ses.sendEmail(emailParams).promise();
}

export const sendEmailGrooming = async (
	emailTo: Array<string>,
	emailFrom: string,
	firstName: string,
	lastName: string,
	email: string,
	phoneNumber: string,
	petName: string,
	checkInDate: string,
	startTime: string,
	endTime: string,
	notes?: string,
) => {
	const htmlTemplate = `
	<html>
		<body style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
			<h1 style="text-align: center; font-size: 24px;">Booking Details</h1>
			<div style="border: 1px solid #ccc; padding: 20px;">
				<p style="font-size: 18px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
				<p style="font-size: 18px;"><strong>Email:</strong> ${email}</p>
				<p style="font-size: 18px;"><strong>Phone Number:</strong> ${phoneNumber}</p>
				<p style="font-size: 18px;"><strong>Pet Name:</strong> ${petName}</p>
				<p style="font-size: 18px;"><strong>Date:</strong> ${checkInDate}</p>
				<p style="font-size: 18px;"><strong>Drop Off Time:</strong> ${startTime}</p>
				<p style="font-size: 18px;"><strong>Pick Up Time:</strong> ${endTime}</p>
				<p style="font-size: 18px;"><strong>Notes:</strong> ${notes}</p>
			</div>
		</body>
	</html>
`
	const emailParams = {
		Destination: {
			ToAddresses: emailTo
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
				Data: `Booking for Grooming: ${firstName} ${lastName} | Pet: ${petName}`
			}
		},
		Source: emailFrom
	}

	return await ses.sendEmail(emailParams).promise();
}

export const sendEmailTraining = async (
	emailTo: Array<string>,
	emailFrom: string,
	firstName: string,
	lastName: string,
	email: string,
	phoneNumber: string,
	petName: string,
	checkInDate: string,
	startTime: string,
	endTime: string,
	notes?: string,
) => {
	const htmlTemplate = `
	<html>
		<body style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
			<h1 style="text-align: center; font-size: 24px;">Booking Details</h1>
			<div style="border: 1px solid #ccc; padding: 20px;">
				<p style="font-size: 18px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
				<p style="font-size: 18px;"><strong>Email:</strong> ${email}</p>
				<p style="font-size: 18px;"><strong>Phone Number:</strong> ${phoneNumber}</p>
				<p style="font-size: 18px;"><strong>Pet Name:</strong> ${petName}</p>
				<p style="font-size: 18px;"><strong>Date:</strong> ${checkInDate}</p>
				<p style="font-size: 18px;"><strong>Start Time:</strong> ${startTime}</p>
				<p style="font-size: 18px;"><strong>End Time:</strong> ${endTime}</p>
				<p style="font-size: 18px;"><strong>Notes:</strong> ${notes}</p>
			</div>
		</body>
	</html>
`
	const emailParams = {
		Destination: {
			ToAddresses: emailTo
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
				Data: `Booking for Training: ${firstName} ${lastName} | Pet: ${petName}`
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