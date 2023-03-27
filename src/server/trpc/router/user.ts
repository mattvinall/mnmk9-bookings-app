import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
	getAllUsers: protectedProcedure.query(async ({ ctx }) => {
		try {
			return await ctx.prisma.user.findMany({
				include: {
					pets: true,
					bookings: true
				}
			});
		} catch (err) {
			console.log(`All users cannot be fetched by email: ${err}`)
		}
	}),
	getRoleById: protectedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			const { id } = input
			return await ctx.prisma.user.findUnique({
				where: { id },
				select: {
					role: true
				}
			});
		}),
	byEmail: protectedProcedure
		.input(z.object({ email: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const { email } = input;
				return await ctx.prisma.user.findUnique({ where: { email }, include: { pets: true, bookings: true,} })
			} catch (err) {
				console.log(`User cannot be fetched by email: ${err}`)
			}
	}),
	byId: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const { id } = input;
				if (!id) {
					throw new TRPCError({code: "BAD_REQUEST"});	
				}
				
				return await ctx.prisma.user.findUnique({ where: { id }, include: { pets: true, bookings: true}})
			} catch (err) {
				console.log(`User cannot be fetched by ID: ${err}`)
			}
		}),
	editProfile: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				address: z.string().optional(),
				city: z.string().optional(),
				postalCode: z.string().optional(),
				phoneNumber: z.string().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id, address, city, postalCode, phoneNumber } = input;
			return await ctx.prisma.user.update({ 
				where: {
					id
				},
				data: {
					address,
					city,
					postalCode,
					phoneNumber
				}
		})
	}),
	makeUserAdmin: protectedProcedure
	.input(
		z.object({
			id: z.string()
		})
	)
	.mutation(async ({ ctx, input }) => {
		const { id } = input;
		try {
			return await ctx.prisma.user.update({
				where: { id },
				data: {
					role: "admin"
				}
			})
		} catch (error) {
			console.log(`error: could not update user role - ${error}`)
		}
	}),
	removeUserAdmin: protectedProcedure
	.input(
		z.object({
			id: z.string()
		})
	)
	.mutation(async ({ ctx, input }) => {
		const { id } = input;
		try {
			return await ctx.prisma.user.update({
				where: { id },
				data: {
					role: "user"
				}
			})
		} catch (error) {
			console.log(`error: could not update user role - ${error}`)
		}
	})
})