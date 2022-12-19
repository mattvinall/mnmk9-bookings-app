import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const petRouter = router({
	getAllPets: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.services.findMany();
	})
});