import { UseFormSetValue } from "react-hook-form/dist/types";
import { BookingFormType, ContactFormType, EditBookingFormType } from "../utils/schema";
import { SubmitHandler, UseFormHandleSubmit } from "react-hook-form/dist/types/form";

import { Pet } from "@prisma/client";

export type FormTypeProps = {
	petData: Pet[]
	isSubmitting: boolean
	register: any
	handleSubmit: UseFormHandleSubmit<BookingFormType>
	onSubmit: SubmitHandler<BookingFormType>
	handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	setToken: (token: string) => void
	setValue: UseFormSetValue<BookingFormType>
}

export type EditBookingFormTypeProps = {
	isSubmitting: boolean
	register: any
	handleSubmit: UseFormHandleSubmit<EditBookingFormType>
	onSubmit: SubmitHandler<EditBookingFormType>
	setShowForm: (showForm: boolean) => void
	setToken: (token: string) => void
}

export type ContactFormTypeProps = {
	isSubmitting: boolean,
	register: any,
	handleSubmit: UseFormHandleSubmit<ContactFormType>,
	onSubmit: SubmitHandler<ContactFormType>
	setToken: (token: string) => void
}