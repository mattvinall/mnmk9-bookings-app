
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const contactRouter = router({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		// return await ctx.prisma.
	}),
	// newContactEmail: publicProcedure
	// .input(
	// 	z.object({
	// 		name: z.string(),
	// 		email: z.string(),
	// 		message: z.string()
	// 	})
	// )
	// .mutation(async ({ ctx, input }) => {
	// 	try {
	// 		const { name, email, message } = input
	// 		return await ctx.prisma.contact.create({
	// 			data: {
	// 				name,
	// 				email,
	// 				message
	// 			}
	// 		})
	// 	} catch (error) {
	// 		console.log(`support email could not be created: ${error}`)
	// 	}
	// }),
});