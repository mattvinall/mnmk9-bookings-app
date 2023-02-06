import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { serviceRouter } from "./service";
import { petRouter } from "./pet";
import { bookingRouter } from "./booking";
import { documentRouter } from "./document";
import { contactRouter } from "./contact";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  service: serviceRouter,
  pet: petRouter,
  bookings: bookingRouter,
  documents: documentRouter,
  contact: contactRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
