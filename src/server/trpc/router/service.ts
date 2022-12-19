import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const serviceRouter = router({
	getAllServices: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.services.findMany();
	})
});