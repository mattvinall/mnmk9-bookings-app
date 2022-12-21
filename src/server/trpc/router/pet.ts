import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const petRouter = router({
	getAllPets: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.pet.findMany();
	})
});