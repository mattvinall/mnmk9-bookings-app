import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimit } from "../../../lib/rateLimit";
import { getCache, setCache } from "../../../lib/cache";
import { Sex, Temperament } from "@prisma/client";

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
				return await ctx.prisma.pet.findMany({ where: { id } })
			} catch (err) {
				console.log(`Pet cannot be fetched by ID: ${err}`)
			}
		}),
	vaccinationsByPetId: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const { id } = input;
				return await ctx.prisma.pet.findMany({ where: { id }, include: {vaccinations: true} })
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
				ownerId: z.string(),
				name: z.string(),
				breed: z.string(),
				sex: z.nativeEnum(Sex),
				age: z.number(),
				weight: z.number(),
				ovariohysterectomy: z.boolean(),
				temperament: z.nativeEnum(Temperament),
				microchipNumber: z.string().optional(),
				medicalNotes: z.string().optional(),
				feedingNotes: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const {
				ownerId, name, breed, sex, age, weight,
				ovariohysterectomy, temperament, microchipNumber,
				medicalNotes, feedingNotes
			} = input;
			try {
				const { success } = await rateLimit.limit(ownerId);
				console.log("success, did not hit over rate limit", success);

				if (!success) {
					throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
				}

				return await ctx.prisma.pet.create({
					data: {
						ownerId,
						name,
						breed,
						sex,
						age,
						weight,
						ovariohysterectomy,
						temperament,
						microchipNumber,
						medicalNotes,
						feedingNotes
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
	editPet: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				breed: z.string().optional(),
				sex: z.nativeEnum(Sex).optional(),
				age: z.number().optional(),
				weight: z.number().optional(),
				ovariohysterectomy: z.boolean().optional(),
				temperament: z.nativeEnum(Temperament).optional(),
				microchipNumber: z.string().optional(),
				medicalNotes: z.string().optional(),
				feedingNotes: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const {
				id,
				name,
				breed,
				sex,
				age,
				weight,
				ovariohysterectomy,
				temperament,
				microchipNumber,
				medicalNotes,
				feedingNotes } = input;
			
			try { 
				const { success } = await rateLimit.limit(id);

				if (!success) {
					throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
				}

				return await ctx.prisma.pet.update({
					where: { id },
					data: {
						name,
						breed,
						sex,
						age,
						weight,
						ovariohysterectomy,
						temperament,
						microchipNumber,
						medicalNotes,
						feedingNotes
					}
				})
			} catch(error) {
				console.log(`Pet cannot be updated: ${error}`)
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
});