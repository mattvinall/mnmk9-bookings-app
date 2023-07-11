import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const serviceRouter = router({
	getAllServices: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.services.findMany();
	}),
	byId: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.query(({ ctx, input }) => { 
			return ctx.prisma.services.findUnique({
				where: {
					id: input.id,
				},
			});
		})
	
});