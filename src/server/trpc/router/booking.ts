import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const bookingRouter = router({
	getAllBookings: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.bookings.findMany();
	}),
	newBooking: protectedProcedure	
		.input(
			z.object({
				firstName: z.string(),
				lastName: z.string(),
				phoneNumber: z.string(),
				email: z.string(),
				checkInDate: z.string(),
				checkOutDate: z.string(),
				petName: z.string(),
				notes: z.string(),
				serviceName: z.string(),
				petId: z.string(),
				serviceId: z.string(),
				userId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const { firstName, lastName, phoneNumber, email, checkInDate, checkOutDate, petName, notes, serviceName, petId, serviceId, userId } = input
				return await ctx.prisma.bookings.create({
					data: {
						firstName,
						lastName,
						phoneNumber,
						email,
						checkInDate,
						checkOutDate,
						petName,
						notes,
						serviceName,
						petId,
						serviceId,
						userId
					}
				})
			} catch (error) {
				console.log(`booking could not be created: ${error}`)
			}
	})
});