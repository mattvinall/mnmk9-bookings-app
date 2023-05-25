import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import Redis from "ioredis";
import { env } from "../../../env/server.mjs";

const client = new Redis(env.REDIS_DB_URL);

const getUserCache = async (key: string) => {
  const cache = await client.get(key);
  return cache ? JSON.parse(cache) : null;
};

const setUserCache = async (key: string, data: [] | {} | null) => {
  await client.set(key, JSON.stringify(data));
  await client.expire(key, 1000);
};

export const userRouter = router({
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    try {
      const cache = await getUserCache("allUsers");
      if (cache) {
        return cache;
      } else {
        const allUsers = await ctx.prisma.user.findMany({
          include: {
            pets: true,
            bookings: true
          }
        });
        await setUserCache("allUsers", allUsers);
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
        const cache = await getUserCache("userByRole");
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
          await setUserCache("userByRole", userByRole);
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
        const cache = await getUserCache("user");
        if (cache) {
          console.log("Cache successfully retrieved: ", cache);
          return cache;
        } else {
          const user = await ctx.prisma.user.findUnique({
            where: { id: input?.id },
            include: { pets: true, bookings: true }
          });
          await setUserCache("user", user);
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