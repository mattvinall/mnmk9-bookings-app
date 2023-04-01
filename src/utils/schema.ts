import { z } from "zod";

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
	notes: z.string(),
	petData: z.object({
		id: z.string(),
		breed: z.string(),
		name: z.string(),
		ownerId: z.string(),
		profileImage: z.string(),
		vaccinated: z.boolean(),
	}).optional()
});

export const addPetFormSchema	= z.object({
	name: z.string().min(1),
	breed: z.string().min(1),
	notes: z.string().min(1),
	vaccinated: z.string() || z.boolean()
});

export const contactFormSchema = z.object({
	name: z.string(),
	email: z.string(),
	message: z.string(),
});

export const editBookingsFormSchema = z.object({
	checkInDate: z.string().optional(),
	checkOutDate: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	notes: z.string().optional(),
	petId: z.string().optional(),
	petName: z.string().optional(),
});

export const userDetailFormSchema = z.object({
	address: z.string().min(6).max(65),
	city: z.string().min(1),
	postalCode: z.string().min(6).max(7),
	phoneNumber: z.string().max(12)
});