import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { rateLimit } from "../../../lib/rateLimit"; 

export const vaccineRouter = router({
    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.vaccination.findMany();
    }),
    byId: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const { id } = input;
            try {
                const getVaccineDocumentById = await ctx.prisma.vaccination.findUnique({
                    where: {
                        id
                    }
                });
                return getVaccineDocumentById;
            } catch (err) {
                console.log(`Vaccine with the ${id} cannot be found: ${err}`)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
        }),
    create: protectedProcedure
        .input(z.object({
            petId: z.string(),
            name: z.string(),
            validTo: z.date(),
            fileName: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const { petId, name, validTo, fileName } = input;
            
            const { success } = await rateLimit.limit(petId)

            if (!success) {
                throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
            }

            try {
                const addVetDetails = await ctx.prisma.vaccination.create({
                    data: {
                        petId,
                        name,
                        validTo,
                        fileName
                    },
                })
                return addVetDetails;
               
            } catch (err) {
                console.log(`Vet ${name} cannot be created: ${err}`)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
        }),
    delete: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const { id } = input;
            try {
                const deleteVaccineDocument = await ctx.prisma.vaccination.delete({
                    where: {
                        id
                    }
                });

                return deleteVaccineDocument;
            } catch (err) {
                console.log(`Vet ${id} cannot be deleted: ${err}`)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
        }),
    update: protectedProcedure
        .input(z.object({
            id: z.string(),
            name: z.string().optional(),
            validTo: z.date().optional(),
            uploadedS3Url: z.string().url().optional(),
            fileName: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, name, validTo, uploadedS3Url, fileName } = input;
            try {
                const updateVaccineDocument = await ctx.prisma.vaccination.update({
                    where: {
                        id
                    },
                    data: {
                        name,
                        validTo,
                        uploadedS3Url,
                        fileName
                    }
                });

                return updateVaccineDocument;
            } catch (err) {
                console.log(`Vet ${id} cannot be updated: ${err}`)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
        }),
    updateS3Url: protectedProcedure
        .input(z.object({
            id: z.string(),
            uploadedS3Url: z.string().url()
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, uploadedS3Url } = input;
            try {
                const updateS3Url = await ctx.prisma.vaccination.update({
                    where: {
                        id
                    },
                    data: {
                        uploadedS3Url
                    }
                });
                return updateS3Url;
            } catch (err) {
                console.log(` ${uploadedS3Url} cannot be updated: ${err}`)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
        })
})