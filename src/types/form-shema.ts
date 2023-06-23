import { PetsArray } from "./router";
import { Temperament, Sex } from "@prisma/client";

export type FormSchemaType = {
	firstName: string
	lastName: string
	phoneNumber: string
	email: string
	checkInDate: string
	checkOutDate: string
	startTime?: string
	endTime?: string
	petName: string
	notes?: string
	serviceName: string
	userId: string
	serviceId: string
	petId: string
	petData?: PetsArray
}

export type AddPetFormSchema = {
	ownerId?: string
	name: string
	breed: string
	sex: Sex
	age: string
	weight: string
	ovariohysterectomy: string
	temperament: Temperament
	microchipNumber: string
	medicalNotes: string
	feedingNotes: string
}

export type VetDetailFormSchema = {
	name: string
	address: string
	city: string
	phone: string
	email: string
}

export type UserFormSchema = {
	address: string
	city: string
	postalCode: string
	phoneNumber: string
}

export type EditBookingFormSchema = {
	checkInDate: string
	checkOutDate: string
	startTime: string
	endTime: string
	petName: string
	petId: string
	notes: string
}