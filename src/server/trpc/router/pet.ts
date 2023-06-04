import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimit } from "../../../lib/rateLimit";
import { getCache, setCache } from "../../../lib/cache";

export const petRouter = router({
	getAllPets: protectedProcedure.query(async ({ ctx }) => {
		try {
			const cache = await getCache("allPets");

			if (cache) {
				return cache;
			} else {
				const allPets = await ctx.prisma.pet.findMany();

				await setCache("allPets", allPets);
				return allPets;
			}
		} catch (error) {
			console.log(`failed to fetch all Pets: ${error}`)
		}
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
			const { id } = input;
			try {
				const cache = await getCache(`pet-owner-${id}`);

				if (cache) {
					return cache;
				} else {
					const petsByOwnerId = await ctx.prisma.pet.findMany({ where: { ownerId: id } });

					await setCache("petsByOwnerId", petsByOwnerId);
					return petsByOwnerId;
				}
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
				const { success } = await rateLimit.limit(ownerId)

				if (!success) {
					throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
				}

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
	editPetNotes: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				notes: z.string().min(1).max(250)
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id, notes } = input;

			try {
				return await ctx.prisma.pet.update({
					where: { id },
					data: { notes },
				})
			} catch (error) {
				console.log(`pet notes could not be updated: ${error}`)
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