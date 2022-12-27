import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const serviceRouter = router({
	getAllServices: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.services.findMany();
	})
});