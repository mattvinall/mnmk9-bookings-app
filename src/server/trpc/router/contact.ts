
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimit } from "../../../lib/rateLimit";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const contactRouter = router({
	getAll: protectedProcedure.input(
		z.object({
			role: z.string(),
		})
	)
	.query(async ({ ctx, input }) => {
		const  { role } = input;
		if (role === "admin") {
			return await ctx.prisma.contact.findMany();
		}
	}),
	newContactEmail: publicProcedure
	.input(
		z.object({
			name: z.string(),
			email: z.string(),
			message: z.string()
		})
	)
	.mutation(async ({ ctx, input }) => {
		try {
			const { name, email, message } = input;
			const { success } = await rateLimit.limit(email)

			if (!success) {
				throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
			}
			
			return await ctx.prisma.contact.create({
				data: {
					name,
					email,
					message
				}
			})
		} catch (error) {
			console.log(`support email could not be created: ${error}`)
		}
	}),
});