import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
	getAllUsers: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.user.findMany();
	}),
})