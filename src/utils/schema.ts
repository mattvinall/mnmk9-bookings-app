import { z } from "zod";
// define schema for the form 
export const schema = z.object({
	firstName: z.string().min(1, { message: "First name is required" }),
	lastName: z.string().min(1, { message: "Last name is required" }),
	phoneNumber: z.string(),
	email: z.string().min(1, { message: "Email is required" }).email({
		message: "Must be a valid email",
	}),
	checkInDate: z.string(),
	checkOutDate: z.string(),
	startTime: z.string(),
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