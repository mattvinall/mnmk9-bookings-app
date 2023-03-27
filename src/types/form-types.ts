import { PetsArray } from "./router";
import { UseFormSetValue } from "react-hook-form/dist/types";
import { FormSchemaType } from "./form-shema";
import { SubmitHandler, UseFormHandleSubmit } from "react-hook-form/dist/types/form";

export type ContactFormType = {
	name: string,
	email: string,
	message: string
}

export type EditBookingFormType = {
	checkInDate?: string,
	checkOutDate: string,
	startTime?: string,
	endTime?: string
	notes?: string,
}

export type FormTypeProps = {
	petData: PetsArray,
	isSubmitting: boolean
	register: any
	handleSubmit: UseFormHandleSubmit<FormSchemaType>
	onSubmit: SubmitHandler<FormSchemaType>
	handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	setToken: (token: string) => void
	setValue: UseFormSetValue<FormSchemaType>
}

export type EditBookingFormTypeProps = {
	isSubmitting: boolean
	register: any
	handleSubmit: UseFormHandleSubmit<EditBookingFormType>
	onSubmit: SubmitHandler<EditBookingFormType>
	setShowForm: (showForm: boolean) => void
}

export type ContactFormTypeProps = {
	isSubmitting: boolean,
	register: any,
	handleSubmit: UseFormHandleSubmit<ContactFormType>,
	onSubmit: SubmitHandler<ContactFormType>
	setToken: (token: string) => void
}