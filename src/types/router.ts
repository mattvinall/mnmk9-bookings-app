import { RouterOutputs } from "../utils/trpc";

export type BookingsArray = RouterOutputs["bookings"]["getAllBookings"];
export type Booking = RouterOutputs["bookings"]["getAllBookings"];
export type PetsArray = RouterOutputs["pet"]["getAllPets"];
export type Pet = RouterOutputs["pet"]["getAllPets"][number];
