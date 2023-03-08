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
	petData?: Array<{
		id: string,
		breed: string,
		name: string,
		ownerId: string,
		profileImage: string,
		vaccinated: boolean,
	}>
}