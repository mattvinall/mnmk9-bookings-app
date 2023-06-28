import { trpc } from "../../utils/trpc";

export const getAllBookings = () => {
    const { data, isLoading, error, refetch } = trpc.bookings.getAllBookings.useQuery();
   
    return { data, isLoading, error, refetch };
}

export const confirmBooking = (id: string, confirmedBooking: boolean, refetch: () => void) => {
    const { mutate } = trpc.bookings.confirmBooking.useMutation({
        onSuccess: () => refetch()
    });

    return mutate({ id, confirmedBooking })
}