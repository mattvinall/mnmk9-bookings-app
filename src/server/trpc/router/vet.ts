import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { rateLimit } from "../../../lib/rateLimit";

export const vetRouter = router({
<<<<<<< HEAD
    getAll: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.vet.findMany();
	}),
=======
>>>>>>> 4034b31 (vet router setup, added create endpoint to add to DB)
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
<<<<<<< HEAD

            const { success } = await rateLimit.limit(petId)

            if (!success) {
                throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
            }

            try {
                const addVetDetails = await ctx.prisma.vet.create({
                    data: {
=======
            try {
                const addVetDetails = await ctx.prisma.vet.create({
                    _data: {
>>>>>>> 4034b31 (vet router setup, added create endpoint to add to DB)
                        petId,
                        name,
                        address,
                        city,
                        email,
                        phone
                    },
<<<<<<< HEAD
                })
                return addVetDetails;
            } catch (err) {
                console.log(`Vet ${name} cannot be created: ${err}`)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
=======
                    get data() {
                        return this._data;
                    },
                    set data(value) {
                        this._data = value;
                    },
                })
                return addVetDetails;
            } catch (err) {
                console.log(`Vet cannot be created: ${err}`)
>>>>>>> 4034b31 (vet router setup, added create endpoint to add to DB)
            }
        })
})