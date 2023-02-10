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
					return await ctx.prisma.pet.findMany({ where: { id }, include: { documents: true } })
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
			console.log(`Pet cannot be fetched by Owner ID: ${err}`)
		}
	}),
	addPet: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				ownerId: z.string(),
				breed: z.string(),
				notes: z.string().optional(),
				vaccinated: z.boolean()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { ownerId, name, breed, notes, vaccinated } = input;
			try {
				return await ctx.prisma.pet.create({
					data: {
						ownerId,
						name, 
						breed,
						notes,
						vaccinated
					}
				})
			} catch (error) {
				console.log(`Pet cannot be created: ${error}`);
			}
		}),
	addPetProfilePicture: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				profileImage: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id, profileImage } = input;

			try {
				return await ctx.prisma.pet.update({
					where: { id },
					data: {
						profileImage
					}
				})
			} catch (error) {
				console.log(`Cannot update profile image of the pet: ${error}`)
			}
		}),
	deletePet: protectedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id } = input;

			try {
				return await ctx.prisma.pet.delete({
					where: { id }
				});
			} catch (error) {
				console.log(`pet could not be deleted: ${error}`)
			}
		}),
	updateVaccinatedStatus: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				vaccinated: z.boolean(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id, vaccinated } = input;

			try {
				if (!vaccinated) {
					return await ctx.prisma.pet.update({
						where: { id },
						data: {
							vaccinated: true
						}
					})
				}
			} catch (error) {
				console.log(`failed to update vaccination status: ${error}`);
			}
		})
});