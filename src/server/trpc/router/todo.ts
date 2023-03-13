import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const todoRouter = router({
	getAll: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.todo.findMany();
	}),
	addTodo: protectedProcedure
	.input(
		z.object({
			authorId: z.string(),
			title: z.string(),
		})
	)
	.mutation(async ({ ctx, input }) => {
		const { authorId, title } = input;
		try {
			return await ctx.prisma.todo.create({
				data: {
					authorId,
					title
				}
			});
		} catch (error) {
			console.log(`todo could not be created: ${error}`)
		}
	}),
	editTodo: protectedProcedure
	.input(
		z.object({
			id: z.string(),
			title: z.string().optional(),
			completed: z.boolean().optional()
		})
	)
	.mutation(async ({ ctx, input }) => {
		const { id, title, completed } = input;
		try {
			return await ctx.prisma.todo.update({
				where: { id },
				data: { title, completed },
			})
		} catch (error) {
			console.log(`todo could not be created: ${error}`)
		}
	}),
	deleteTodo: protectedProcedure
	.input(
		z.object({
			id: z.string(),
		})
	)
	.mutation(async ({ ctx, input }) => {
		const { id } = input;
		try {
			return await ctx.prisma.todo.delete({
				where: { id }
			});
		} catch (error) {
			console.log(`todo could not be deleted: ${error}`);
		}
	}),
	updateCompletedStatus: protectedProcedure
	.input(
		z.object({
			id: z.string(),
			completed: z.boolean(),
		})
	)
	.mutation(async ({ ctx, input }) => {
		const { id, completed } = input;
		try {
			return await ctx.prisma.todo.update({
				where: { id },
				data: {
					completed: !completed
				}
			})
		} catch (error) {
			console.log(`completed status of todo could not be updated, ${error}`)
		}
	})
});