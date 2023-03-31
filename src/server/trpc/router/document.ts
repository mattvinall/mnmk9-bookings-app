import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimit } from "../../../lib/rateLimit";

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
				const { success } = await rateLimit.limit(petId)

				if (!success) {
					throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
				}
				
				return await ctx.prisma.documents.create({
					data: { petId, fileName }
				})
			} catch (error) {
				console.log(`failed to create new vaccination document: ${error}`)
			}
		}),
	addWaiverDocument: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				fileName: z.string(),
				url: z.string().url()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id, fileName, url } = input;
			try {
				const { success } = await rateLimit.limit(id)

				if (!success) {
					throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
				}
				
				return await ctx.prisma.documents.create({
					data: { petId: id, fileName, url }
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