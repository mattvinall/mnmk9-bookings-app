import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from "sweetalert2";
import EditBookingForm from "../../components/forms/EditBookingForm";

const BookingDetail: NextPage = () => {
	const router = useRouter();
	const bookingId = router.query.id as string;
	const { data: bookingDetail, isLoading, error, refetch } = trpc.bookings.byId.useQuery({ id: bookingId });

	console.log("booking detail", bookingDetail);

	type FormSchemaType = {
		checkInDate?: string,
		checkOutDate?: string,
		startTime?: string,
		endTime?: string
		notes?: string,
	}

	// define schema for the form 
	const schema = z.object({
		checkInDate: z.string().optional(),
		checkOutDate: z.string().optional(),
		startTime: z.string().optional(),
		endTime: z.string().optional(),
		notes: z.string().optional(),
	})

	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({
		resolver: zodResolver(schema)
	});

	const editBooking = trpc.bookings.editBooking.useMutation();

	const cancelBooking = trpc.bookings.cancelBooking.useMutation()

	const onSubmit: SubmitHandler<FormSchemaType> = async (formData: any) => {

		try {
			Swal.fire({
				title: 'Are you sure you want to Edit?',
				showDenyButton: true,
				confirmButtonText: 'Yes',
			}).then((result) => {
				if (result.isConfirmed) {
					// mutate / POST request to bookings api endpoint and submit the form data
					formData.id = bookingDetail?.id;

					editBooking.mutate(formData);

					Swal.fire('Successfully Edited Your Booking', '', 'success');

					router.push("/manage-booking")
				}
			})
		} catch (error) {
			// error message
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `Something went wrong! ${error}`,
			});
		}

		// reset the form state
		reset();
	}

	const [showForm, setShowForm] = useState(false);

	const handleEditBooking = () => {
		setShowForm((prev) => !prev);
		console.log("show form state", showForm);
	}

	const handleCancelBooking = (id: String) => {
		try {
			Swal.fire({
				title: 'Are you sure you want to cancel?',
				showDenyButton: true,
				confirmButtonText: 'Yes',
			}).then((result) => {
				if (result.isConfirmed) {
					const bookingId = id as string;
					cancelBooking.mutate({ id: bookingId });

					Swal.fire('Cancelled Booking', '', 'success');

					// redirect to home page after cancelling
					router.push("/");
				}
			})
			console.log("cancel booking", cancelBooking);
		} catch (error) {
			// error message
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `Something went wrong! ${error}`,
			});
		}
	}

	if (isLoading) return <p className="text-xl5 text-white flex align-center">Loading ...</p>;

	if (error) return <p className="text-xl3 text-white flex align-center"> Error... {error.message}</p >

	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<Link className="flex justify-start text-left text-white font-bold text-2xl" href="/manage-booking">Go Back</Link>
			<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-8">
				Manage Booking: <span className="text-[hsl(280,100%,70%)]">{bookingDetail?.serviceName}</span>
			</h1>

			<p className="text-white text-center w-[80%] font-bold sm:text-[2.5rem]">
				Need to switch your booking date or time?<br />
				Click the buttons if you want to edit or cancel your booking.
			</p>
			<div className="flex justify-center">
				<button
					onClick={handleEditBooking}
					className="mt-[25px] mr-3 rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
					Edit Booking
				</button>
				<button
					onClick={() => handleCancelBooking(bookingDetail?.id as string)}
					className="mt-[25px] ml-3 rounded-full bg-gradient-to-l from-[#667eea] to-[#764ba2] hover:bg-gradient-to-r from-[#764ba2] to-[#667eea] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
					Cancel Booking
				</button>
			</div>
			{showForm ? (
				<EditBookingForm
					bookingDetail={bookingDetail}
					register={register}
					isSubmitting={isSubmitting}
					onSubmit={onSubmit}
					handleSubmit={handleSubmit}
				/>
			) : null}
		</div>
	)
}

export default BookingDetail;