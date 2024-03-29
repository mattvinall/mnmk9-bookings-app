import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { rateLimit } from "../../../lib/rateLimit";

export const waiverRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.vaccination.findMany();
  }),
  byPetId: protectedProcedure
    .input(z.object({ petId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { petId } = input;
        return await ctx.prisma.waiver.findFirst({ where: { petId } });
      } catch (error) {
        console.log(`Booking cannot be fetched by ID: ${error}`);
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        name: z.string(),
        validTo: z.date(),
        uploadedS3Url: z.string().url(),
        fileName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { petId, name, validTo, uploadedS3Url, fileName } = input;

      const { success } = await rateLimit.limit(petId);

      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      try {
        const addWaiverDocument = await ctx.prisma.waiver.create({
          data: {
            petId,
            name,
            validTo,
            uploadedS3Url,
            fileName,
          },
        });
        return addWaiverDocument;
      } catch (err) {
        console.log(`Vet ${name} cannot be created: ${err}`);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
