import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const bookingRouter = router({
	getAllBookings: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.bookings.findMany();
	})
});