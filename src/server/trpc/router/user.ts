import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
	getAllUsers: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.user.findMany();
	}),
	byEmail: protectedProcedure
		.input(z.object({ email: z.string() }))
		.query(({ ctx, input }) => {
		return ctx.prisma.user.findUnique({ where: { email: input?.email} })
	}),
	byId:protectedProcedure
	.input(z.object({ id: z.string() }))
	.query(({ ctx, input }) => {
	return ctx.prisma.user.findUnique({ where: { id: input?.id} })
	})
})