import { router } from "../trpc";
import { userRouter } from "./user";
import { serviceRouter } from "./service";
import { petRouter } from "./pet";
import { bookingRouter } from "./booking";
import { documentRouter } from "./document";
import { contactRouter } from "./contact";
import { todoRouter } from "./todo";
import { vetRouter } from "./vet";
import { recaptchaRouter } from "./recaptcha";

export const appRouter = router({
  user: userRouter,
  service: serviceRouter,
  pet: petRouter,
  bookings: bookingRouter,
  documents: documentRouter,
  contact: contactRouter,
  todo: todoRouter,
  recaptcha: recaptchaRouter,
  vet: vetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
