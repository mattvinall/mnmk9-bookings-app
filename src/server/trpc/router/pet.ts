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
					return await ctx.prisma.pet.findMany({ where: { id } })
			} catch (err) {
				console.log(`Pet cannot be fetched by ID: ${err}`)
			}
	}),
	byOwnerId: protectedProcedure
	.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const { id } = input;
				return await ctx.prisma.pet.findMany({ where: { ownerId: id } })
		} catch (err) {
			console.log(`Pet cannot be fetched by ID: ${err}`)
		}
	}),
	addPet: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				ownerId: z.string(),
				breed: z.string(),
				vaccinated: z.boolean()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { ownerId, name, breed, vaccinated } = input;
			try {
				return await ctx.prisma.pet.create({
					data: {
						ownerId,
						name, 
						breed, 
						vaccinated
					}
				})
			} catch (error) {
				console.log(`Pet cannot be created: ${error}`);
			}
		})
});