import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const petRouter = router({
	getAllPets: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.pet.findMany();
	}),
	byId: protectedProcedure
	.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const { id } = input;
				return await ctx.prisma.pet.findMany({ where: { ownerId: id } })
		} catch (err) {
			console.log(`Pet cannot be fetched by ID: ${err}`)
		}
}),
});