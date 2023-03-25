import { PetsArray } from "./router";
import { UseFormSetValue } from "react-hook-form/dist/types";
import { FormSchemaType } from "./form-shema";
import { SubmitHandler, UseFormHandleSubmit } from "react-hook-form/dist/types/form";

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
	handleSubmit: UseFormHandleSubmit<FormSchemaType>
	onSubmit: SubmitHandler<FormSchemaType>
	setShowForm: (showForm: boolean) => void
}

export type ContactFormTypeProps = {
	isSubmitting: boolean,
	register: any,
	handleSubmit: UseFormHandleSubmit<ContactFormType>,
	onSubmit: SubmitHandler<ContactFormType>
	setToken: (token: string) => void
}

export type ContactFormType = {
	name: string,
	email: string,
	message: string
}