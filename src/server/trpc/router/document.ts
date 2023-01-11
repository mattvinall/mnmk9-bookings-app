import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const documentRouter = router({
	getAllVaccinationDocuments: protectedProcedure.query(async ({ ctx }) => {
		try {
			return await ctx.prisma.bookings.findMany();
		} catch (error) {
			console.log(`failed to fetch all documents: ${error}`)
		}
	}),
	addVaccinationDocument: protectedProcedure
		.input(
			z.object({
				petId: z.string(),
				fileName: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { petId, fileName } = input;
			try {
				return await ctx.prisma.documents.create({
					data: { petId, fileName }
				})
			} catch (error) {
				console.log(`failed to create new vaccination document: ${error}`)
			}
		}),
	deleteVaccinationDocument: protectedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id } = input;

			try {
				return await ctx.prisma.documents.delete({
					where: {
						id
					}
				})
			} catch (error) {
				console.log(`document could not be deleted: ${error}`)
			}
		}),
})