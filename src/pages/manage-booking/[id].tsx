import { useState } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from "sweetalert2";
import EditBookingForm from "../../components/client/forms/EditBookingForm";
import { editBookingsFormSchema } from "../../utils/schema";
import { EditBookingFormType } from "../../types/form-types";

const BookingDetail: NextPage = () => {
	const router = useRouter();
	const bookingId = router.query.id as string;
	const { data: bookingDetail, isLoading, error } = trpc.bookings.byId.useQuery({ id: bookingId });


	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditBookingFormType>({
		resolver: zodResolver(editBookingsFormSchema)
	});

	const editBooking = trpc.bookings.editBooking.useMutation();

	const cancelBooking = trpc.bookings.cancelBooking.useMutation()

	const onSubmit: SubmitHandler<EditBookingFormType> = async (formData: any) => {

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

	const [showForm, setShowForm] = useState(true);

	const handleShowEditBookingForm = () => {
		setShowForm(true);
	}

	const handleCancelBooking = (id: string) => {
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
			});
		} catch (error) {
			// error message
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `Something went wrong! ${error}`,
			});
		}
	}

	if (isLoading) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Loading....</h1>
		</div>
	);

	if (error) return (
		<div className="container text-center">
			<h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Error....please contact support</h1>
		</div>
	);

	return (
		<div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
			<Link className="flex justify-start text-left text-white font-bold text-2xl" href="/manage-booking">Go Back</Link>
			<h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-8">
				Manage Booking: <span className="text-[hsl(280,100%,70%)]">{bookingDetail?.serviceName}</span>
			</h1>

			<nav className="text-md font-medium text-center text-gray-500 border-b border-gray-500 dark:text-gray-400 dark:border-gray-500">
				<ul className="flex flex-wrap">
					<li>
						<button onClick={handleShowEditBookingForm} className={`${showForm === true ? "text-gray-100 !border-gray-100 border-b-2" : ""} inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-100 hover:border-gray-100`}>Edit Booking</button>
					</li>
					<li>
						<button onClick={() => handleCancelBooking(bookingDetail?.id as string)} className={"hover:text-gray-100 !border-gray-100 hover:border-b-2 inline-block p-4 hover:border-b-2 borded-t-lg text-gray-transparent rounded-100 hover:border-gray-100"}>Cancel Booking</button>
					</li>
				</ul>
			</nav>
			{showForm ? (
				<EditBookingForm
					register={register}
					isSubmitting={isSubmitting}
					onSubmit={onSubmit}
					handleSubmit={handleSubmit}
					setShowForm={setShowForm}
				/>
			) : null}
		</div>
	)
}

export default BookingDetail;