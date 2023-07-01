import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { rateLimit } from "../../../lib/rateLimit";

export const vetRouter = router({
    getAll: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.vet.findMany();
	}),
    create: protectedProcedure
        .input(z.object({
            petId: z.string(),
            name: z.string(),
            address: z.string(),
            city: z.string(),
            email: z.string().email(),
            phone: z.string()
        }))
        .mutation(async ({ ctx, input }) => { 
            const { petId, name, address, city, email, phone } = input;

            const { success } = await rateLimit.limit(petId)

            if (!success) {
                throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
            }

            try {
                const addVetDetails = await ctx.prisma.vet.create({
                    data: {
                        petId,
                        name,
                        address,
                        city,
                        email,
                        phone
                    },
                })
                return addVetDetails;
               
            } catch (err) {
                console.log(`Vet ${name} cannot be created: ${err}`)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
        })
})