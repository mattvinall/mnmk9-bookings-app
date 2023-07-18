import { router } from "../trpc";
import { userRouter } from "./user";
import { serviceRouter } from "./service";
import { petRouter } from "./pet";
import { bookingRouter } from "./booking";
import { contactRouter } from "./contact";
import { todoRouter } from "./todo";
import { vetRouter } from "./vet";
import { recaptchaRouter } from "./recaptcha";
import { incidentReportRouter } from "./incidentReport";
import { waiverRouter } from "./waiver";
import { vaccineRouter } from "./vaccine";
import { invoiceRouter } from "./invoice";

export const appRouter = router({
  user: userRouter,
  service: serviceRouter,
  vet: vetRouter,
  pet: petRouter,
  bookings: bookingRouter,
  contact: contactRouter,
  todo: todoRouter,
  recaptcha: recaptchaRouter,
  incidentReport: incidentReportRouter,
  waiver: waiverRouter,
  vaccine: vaccineRouter,
  invoice: invoiceRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
