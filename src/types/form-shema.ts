import { PetsArray } from "./router";

export type FormSchemaType = {
	firstName: string,
	lastName: string,
	phoneNumber: string,
	email: string,
	checkInDate: string,
	checkOutDate: string,
	startTime?: string,
	endTime?: string,
	petName: string,
	notes?: string,
	serviceName: string,
	userId: string,
	serviceId: string,
	petId: string,
	petData?: PetsArray
}

export type AddPetFormSchema = {
	name: string,
	breed: string,
	notes: string,
	vaccinated: boolean
}

export type UserFormSchema = {
	address: string,
	city: string,
	postalCode: string,
	phoneNumber: string,
}

export type EditBookingFormSchema = {
	checkInDate: string
	checkOutDate: string
	startTime: string
	endTime: string
	petName: string,
	petId: string
	notes: string
}