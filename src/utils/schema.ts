import { Sex, Temperament } from "@prisma/client";
import { z } from "zod";

export const userSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	firstName: z.string(),
	lastName: z.string(),
	role: z.string(),
	phoneNumber: z.string(),
	address: z.string(),
	city: z.string(),
	postalCode: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	pets: z.object({
		id: z.string(),
		name: z.string(),
		ownerId: z.string(),
		breed: z.string(),
		age: z.number(),
		weight: z.number(),
		profileImage: z.string().url(),
		ovariohysterectomy: z.boolean(),
		microchipNumber: z.string().optional(),
		medicalNotes: z.string().optional(),
		feedingNotes: z.string().optional(),
		temperament: z.nativeEnum(Temperament),
		vaccinations: z.object({
			id: z.string(),
			petId: z.string(),
			vaccineName: z.string(),
			validTo: z.date(),
			uploadedS3Url: z.string().url(),
		}).optional(),
		bookings: z.object({
			id: z.string(),
			petId: z.string(),
			serviceId: z.string(),
			serviceName: z.string(),
			userId: z.string(),
			email: z.string(),
			firstName: z.string(),
			lastName: z.string(),
			phoneNumber: z.string(),
			checkInDate: z.string(),
			checkOutDate: z.string(),
			startTime: z.string().optional(),
			endTime: z.string(),
			notes: z.string(),
			petName: z.string(),
			confirmedBooking: z.boolean(),
			createdAt: z.date(),
			updatedAt: z.date(),
		}).optional(),
		vetInformation: z.object({
			id: z.string(),
			petId: z.string(),
			name: z.string(),
			address: z.string(),
			city: z.string(),
			phone: z.string(),
			createdAt: z.date(),
		}).optional(),
		profileImages: z.object({
			id: z.string(),
			petId: z.string(),
			fileName: z.string(),
			uploadedS3Url: z.string().url(),
		}).optional(),
	}),
	bookings: z.object({
		id: z.string(),
		petId: z.string(),
		serviceId: z.string(),
		serviceName: z.string(),
		userId: z.string(),
		email: z.string(),
		firstName: z.string(),
		lastName: z.string(),
		phoneNumber: z.string(),
		checkInDate: z.string(),
		checkOutDate: z.string(),
		startTime: z.string().optional(),
		endTime: z.string(),
		notes: z.string(),
		petName: z.string(),
		confirmedBooking: z.boolean(),
		createdAt: z.date(),
		updatedAt: z.date(),
	}).optional(),
});

export type UserType = z.infer<typeof userSchema>;

// define schema for the form 
export const bookingFormSchema = z.object({
	firstName: z.string().min(1, { message: "First name is required" }),
	lastName: z.string().min(1, { message: "Last name is required" }),
	phoneNumber: z.string(),
	email: z.string().min(1, { message: "Email is required" }).email({
		message: "Must be a valid email",
	}),
	checkInDate: z.string(),
	checkOutDate: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	petName: z.string(),
	notes: z.string().optional(),
});

export type BookingFormType = z.infer<typeof bookingFormSchema>;

// define schema for the form 
export const adminBookingFormSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	petName: z.string().min(1, { message: "Pet name is required" }),
	serviceName: z.string(),
	phoneNumber: z.string(),
	email: z.string().min(1, { message: "Email is required" }).email({
		message: "Must be a valid email",
	}),
	checkInDate: z.string(),
	checkOutDate: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	notes: z.string().optional(),
});

export type AdminBookingFormType = z.infer<typeof adminBookingFormSchema>;

export const editBookingFormSchema = z.object({
	checkInDate: z.string().optional(),
	checkOutDate: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	notes: z.string().optional(),
});

export type EditBookingFormType = z.infer<typeof editBookingFormSchema>;

export const addPetFormSchema = z.object({
	name: z.string(),
	breed: z.string(),
	sex: z.nativeEnum(Sex),
	age: z.string(),
	weight: z.string(),
	ovariohysterectomy: z.string(),
	temperament: z.nativeEnum(Temperament),
	microchipNumber: z.string().optional(),
	medicalNotes: z.string().optional(),
	feedingNotes: z.string().optional(),
});

export type AddPetFormType = z.infer<typeof addPetFormSchema>;

export const editPetFormSchema = z.object({
	name: z.string().optional(),
	breed: z.string().optional(),
	sex: z.nativeEnum(Sex).optional(),
	age: z.string().optional(),
	weight: z.string().optional(),
	ovariohysterectomy: z.string().optional(),
	temperament: z.nativeEnum(Temperament).optional(),
	microchipNumber: z.string().optional(),
	medicalNotes: z.string().optional(),
	feedingNotes: z.string().optional(),
});

export type EditPetFormType = z.infer<typeof editPetFormSchema>;

export const vetDetailFormSchema = z.object({
	name: z.string(),
	address: z.string(),
	city: z.string(),
	phone: z.string(),
});

export type VetDetailFormType = z.infer<typeof vetDetailFormSchema>;

export const contactFormSchema = z.object({
	name: z.string(),
	email: z.string(),
	message: z.string(),
});

export type ContactFormType = z.infer<typeof contactFormSchema>;

export const editBookingsFormSchema = z.object({
	checkInDate: z.string().optional(),
	checkOutDate: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	notes: z.string().optional(),
	petId: z.string().optional(),
	petName: z.string().optional(),
});

export type editBookingsFormType = z.infer<typeof editBookingsFormSchema>;

export const userDetailFormSchema = z.object({
	address: z.string().min(6).max(65),
	city: z.string().min(1),
	postalCode: z.string().min(6).max(7),
	phoneNumber: z.string().max(12)
});

export type UserDetailFormType = z.infer<typeof userDetailFormSchema>;

export const vaccineFormSchema = z.object({
	name: z.string(),
	validTo: z.string(),
});

export type VaccineFormType = z.infer<typeof vaccineFormSchema>;

export const waiverFormSchema = z.object({
	name: z.string(),
	fileName: z.string(),
	uploadedS3Url: z.string().url(),
	validTo: z.date(),
});

export type WaiverFormType = z.infer<typeof waiverFormSchema>;