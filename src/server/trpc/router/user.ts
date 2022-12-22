import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
	getAllUsers: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.user.findMany({
			include: {
				pets: true,
				bookings: true
			}
		});
	}),
	byEmail: protectedProcedure
		.input(z.object({ email: z.string() }))
		.query(({ ctx, input }) => {
			return ctx.prisma.user.findUnique({ where: { email: input?.email}, include: { pets: true, bookings: true,} })
	}),
	byId: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) => {
			return ctx.prisma.user.findUnique({ where: { id: input?.id} })
	}),
})