import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { rateLimit } from "../../../lib/rateLimit";

export const incidentReportRouter = router({
    getAll: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.incidentReport.findMany();
	}),
    create: protectedProcedure
        .input(z.object({
            petId: z.string(),
            petName: z.string(),
            incidentDate: z.date(),
            incidentCount: z.number(),
            incidentDescription: z.string(),
        }))
        .mutation(async ({ ctx, input }) => { 
            
            const { petId, petName, incidentDate, incidentCount, incidentDescription } = input;

            const { success } = await rateLimit.limit(petId)

            if (!success) {
                throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
            }

            try {
                const addVetDetails = await ctx.prisma.incidentReport.create({
                    data: {
                        petId,
                        petName,
                        incidentDate,
                        incidentCount,
                        incidentDescription
                    },
                })
                return addVetDetails;
            } catch (err) {
                console.log(`Vet ${name} cannot be created: ${err}`)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
        })
})