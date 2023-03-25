import { PetsArray } from "./router";
import { UseFormSetValue } from "react-hook-form/dist/types";
import { FormSchemaType } from "./form-shema";
import { SubmitHandler } from "react-hook-form";
import { FieldValues } from "react-hook-form/dist/types/fields";
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form/dist/types/form";

export type FormTypeProps<TFieldValues extends FieldValues> = {
	petData: PetsArray,
	isSubmitting: boolean
	register: UseFormRegister<TFieldValues>
	handleSubmit: UseFormHandleSubmit<TFieldValues>
	onSubmit: SubmitHandler<FormSchemaType>
	handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	setToken: (token: string) => void
	setValue: UseFormSetValue<FormSchemaType>
}

export type EditBookingFormTypeProps<TFieldValues extends FieldValues> = {
	isSubmitting: boolean
	register: UseFormRegister<TFieldValues>
	handleSubmit: UseFormHandleSubmit<TFieldValues>
	onSubmit: SubmitHandler<FormSchemaType>
	setShowForm: (showForm: boolean) => void
}

export type ContactFormTypeProps<TFieldValues extends FieldValues> = {
	isSubmitting: boolean
	register: UseFormRegister<TFieldValues>
	handleSubmit: UseFormHandleSubmit<TFieldValues>,
	onSubmit: SubmitHandler<ContactFormType>
	setToken: (token: string) => void
}

export type ContactFormType = {
	name: string,
	email: string,
	message: string
}