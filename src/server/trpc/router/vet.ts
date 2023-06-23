import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { rateLimit } from "../../../lib/rateLimit";

export const vetRouter = router({
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
            try {
                const addVetDetails = await ctx.prisma.vet.create({
                    _data: {
                        petId,
                        name,
                        address,
                        city,
                        email,
                        phone
                    },
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
            }
        })
})