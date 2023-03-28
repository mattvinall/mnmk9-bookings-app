import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimit } from "../../../lib/rateLimit";
import fetch from "node-fetch";

export const recaptchaRouter = router({
	verify: protectedProcedure
		.input(
			z.object({ token: z.string(), secret: z.string() })
		)
		.mutation(async ({ ctx, input }) => { 
			const { token, secret } = input;
			
			try {
				const { success: rateLimitSuccess } = await rateLimit.limit(token)
				if (!rateLimitSuccess) {
					throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
				}
				const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
					},
					body: `secret=${secret}&response=${token}`
				}); 

				console.log("response in trpc router recaptcha", response)
				const json = (await response.json()) as { success: boolean, score: number };
				console.log("json recaptcha", json)
				if (!json.success) {
					throw new TRPCError({code: "BAD_REQUEST"});
				}

				return {
					success: json.success,
					score: json.score
				}

			} catch (error) {
				console.log(`Recaptcha cannot be verified: ${error}`);
			}
		})
})