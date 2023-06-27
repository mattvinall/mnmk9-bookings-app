import { Sex, Temperament } from "@prisma/client";
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
	notes: z.string().optional(),
});

export type BookingFormType = z.infer<typeof bookingFormSchema>;

export const editBookingFormSchema = z.object({
	checkInDate: z.string().optional(),
	checkOutDate: z.string().optional(),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
	notes: z.string().optional(),
});

export type EditBookingFormType = z.infer<typeof editBookingFormSchema>;

export const addPetFormSchema = z.object({
	ownerId: z.string().optional(),
	name: z.string(),
	breed: z.string(),
	sex: z.nativeEnum(Sex),
	age: z.string().optional(),
	weight: z.string().optional(),
	ovariohysterectomy: z.string(),
	temperament: z.nativeEnum(Temperament),
	microchipNumber: z.string().optional(),
	medicalNotes: z.string().optional(),
	feedingNotes: z.string().optional(),
});

export type AddPetFormType = z.infer<typeof addPetFormSchema>;

export const vetDetailFormSchema = z.object({
	name: z.string(),
	address: z.string(),
	city: z.string(),
	phoneNumber: z.string(),
	email: z.string().email(),
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