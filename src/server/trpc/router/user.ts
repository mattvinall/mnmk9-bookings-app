import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { getCache, setCache, invalidateCache } from "../../../lib/cache";

export const userRouter = router({
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    try {
      const cache = await getCache("allUsers");
      if (cache) {
        return cache;
      } else {
        const allUsers = await ctx.prisma.user.findMany({
          include: {
            pets: true,
            bookings: true
          }
        });
        await setCache("allUsers", allUsers);
        return allUsers;
      }
    } catch (err) {
      console.log(`Error fetching all users: ${err}`);
    }
  }),

  getRoleById: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const cache = await getCache("userByRole");
        if (cache) {
          console.log("Cache successfully retrieved: ", cache);
          return cache;
        } else {
          const { id } = input;
          const userByRole = await ctx.prisma.user.findUnique({
            where: { id },
            select: {
              role: true
            }
          });
          await setCache("userByRole", userByRole);
          return userByRole;
        }
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
          include: { pets: true, bookings: true }
        });
      } catch (err) {
        console.log(`Error fetching user by email: ${err}`);
      }
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const cache = await getCache("user");
        if (cache) {
          console.log("Cache successfully retrieved: ", cache);
          return cache;
        } else {
          const user = await ctx.prisma.user.findUnique({
            where: { id: input?.id },
            include: { pets: true, bookings: true }
          });
          await setCache(`user-${user?.name}`, user);
          return user;
        }
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
        phoneNumber: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, address, city, postalCode, phoneNumber } = input;

      // invalidate cache before making update to DB
      await invalidateCache(`user-${id}`);
      await invalidateCache("allUsers");

      return await ctx.prisma.user.update({
        where: {
          id
        },
        data: {
          address,
          city,
          postalCode,
          phoneNumber
        }
      });
    }),

  makeUserAdmin: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      try {
        // invalidate cache before making update to DB
        await invalidateCache(`user-${id}`);
        await invalidateCache("allUsers");

        return await ctx.prisma.user.update({
          where: { id },
          data: {
            role: "admin"
          }
        });
      } catch (error) {
        console.log(`Error updating user role: ${error}`);
      }
    }),

  removeUserAdmin: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      try {
        // invalidate cache before making update to DB
        await invalidateCache(`user-${id}`);
        await invalidateCache("allUsers");

        return await ctx.prisma.user.update({
          where: { id },
          data: {
            role: "user"
          }
        });
      } catch (error) {
        console.log(`Error updating user role: ${error}`);
      }
    })
});