import { PetsArray } from "./router";
import { UseFormSetValue, UseFormRegister } from "react-hook-form/dist/types";
import { FormSchemaType } from "./form-shema";
import { SubmitHandler } from "react-hook-form";

export type FormTypeProps = {
	petData: PetsArray,
	isSubmitting: boolean
	register: UseFormRegister<FormSchemaType>
	// register: any
	handleSubmit: any
	onSubmit: SubmitHandler<FormSchemaType>
	handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	setToken: (token: string) => void
	setValue: UseFormSetValue<FormSchemaType>
}

export type EditBookingFormTypeProps = {
	isSubmitting: boolean
	// register: UseFormRegister<FormSchemaType>
	register: any
	handleSubmit: any,
	onSubmit: SubmitHandler<FormSchemaType>
	setShowForm: (showForm: boolean) => void
}