import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    try {
      const allUsers = await ctx.prisma.user.findMany({
        include: {
          pets: true,
          bookings: true,
        },
      });
      return allUsers;
    } catch (err) {
      console.log(`Error fetching all users: ${err}`);
    }
  }),
  createUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email } = input;
      try {
        const user = await ctx.prisma.user.create({
          data: { name, email },
        });
        return user;
      } catch (err) {
        console.log(`Error creating user: ${err}`);
      }
    }),
  getRoleById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        const userByRole = await ctx.prisma.user.findUnique({
          where: { id },
          select: { role: true },
        });
        return userByRole;
      } catch (err) {
        console.log(`Error fetching user by role: ${err}`);
      }
    }),
  byEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { email } = input;
        return await ctx.prisma.user.findUnique({
          where: { email },
          include: { pets: true, bookings: true },
        });
      } catch (err) {
        console.log(`Error fetching user by email: ${err}`);
      }
    }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        const user = await ctx.prisma.user.findUnique({
          where: { id },
          include: { pets: true, bookings: true },
        });
        return user;
      } catch (err) {
        console.log(`Error fetching user by ID: ${err}`);
      }
    }),
  editProfile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        phoneNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, address, city, postalCode, phoneNumber } = input;
      return await ctx.prisma.user.update({
        where: { id },
        data: { address, city, postalCode, phoneNumber },
      });
    }),
  makeUserAdmin: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.user.update({
        where: { id },
        data: { role: "admin" },
      });
    }),
  removeUserAdmin: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.user.update({
        where: { id },
        data: { role: "user" },
      });
    }),
  fetchVetInfo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      try {
        const vet = await ctx.prisma.user.findUnique({
          where: { id },
          include: { vetInfo: true },
        });
        return vet;
      } catch (error) {
        console.log(`Error fetching user vet info: ${error}`);
      }
    }),
});
