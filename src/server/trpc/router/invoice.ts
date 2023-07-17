import { z } from "zod";

import { router, protectedProcedure } from "../trpc";
import { TRPCError } from '@trpc/server';
import { rateLimit } from './../../../lib/rateLimit';
import { getCache, setCache, invalidateCache } from "../../../lib/cache";

export const invoiceRouter = router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        try {
            const cache = await getCache("allInvoices");

            if (cache) {
                return cache;
            } else {
                const allInvoices = await ctx.prisma.invoice.findMany();

                await setCache("allInvoices", allInvoices);
                return allInvoices;
            }
        } catch (error) {
            console.log(`failed to fetch all invoices: ${error}`)
        }
    }),
    getById: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ ctx, input }) => {
            try {
                const cache = await getCache(`invoice-${input.id}`);

                if (cache) {
                    return cache;
                } else {
                    const invoice = await ctx.prisma.invoice.findUnique({
                        where: {
                            id: input.id
                        }
                    });

                    await setCache(`invoice-${input.id}`, invoice);
                    return invoice;
                }
            } catch (err) {
                return new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to fetch invoice with id ${input.id}`
                })
            }
        }),
    create: protectedProcedure
        .input(z.object({
            bookingId: z.string(),
            serviceId: z.string(),
            petId: z.string(),
            clientId: z.string(),
            petName: z.string(),
            customerName: z.string(),
            customerEmail: z.string().email(),
            customerAddress: z.string(),
            customerCity: z.string(),
            serviceName: z.string(),
            servicePrice: z.number(),
            serviceDuration: z.number(),
            subtotal: z.number(),
            taxAmount: z.number(),
            total: z.number(),
            dueDate: z.string() || z.date(),
            createdAt: z.string() || z.date(),
        }))
        .mutation(async ({ ctx, input }) => { 
            try {
                const { success } = await rateLimit.limit(input.clientId);

                if (!success) {
                    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests" });
                }

                const newInvoice = await ctx.prisma.invoice.create({
                    data: {
                        bookingId: input.bookingId,
                        serviceId: input.serviceId,
                        petId: input.petId,
                        clientId: input.clientId,
                        petName: input.petName,
                        customerName: input.customerName,
                        customerEmail: input.customerEmail,
                        customerAddress: input.customerAddress,
                        customerCity: input.customerCity,
                        serviceName: input.serviceName,
                        servicePrice: input.servicePrice,
                        serviceDuration: input.serviceDuration,
                        subtotal: input.subtotal,
                        taxAmount: input.taxAmount,
                        total: input.total,
                        dueDate: new Date(input.dueDate),
                        createdAt: new Date(input.createdAt),
                    }
                });

                await invalidateCache("allInvoices");
                await invalidateCache(`invoice-${newInvoice.id}`);

                return newInvoice;
                
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to create invoice: ${error}`
                })
            }
        })
    
})