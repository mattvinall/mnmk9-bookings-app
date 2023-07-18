import { useEffect, useState } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from "sweetalert2";
import EditBookingForm from "../../components/client/forms/EditBookingForm";
import { editBookingsFormSchema, EditBookingFormType } from "../../utils/schema";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { generateInvoice } from "../../utils/invoice";
import { Invoice, calculateServiceDuration, calculateSubtotal, calculateTaxAmount, calculateTotalAmount } from "../../utils/invoice";
import { getUserById } from "../../api/users";
import { Services } from "@prisma/client";

const BookingDetail: NextPage = () => {
	const router = useRouter();
	const bookingId = router.query.id as string;

	const [token, setToken] = useState<string>("");
	const [key, setKey] = useState<string>("")
	const [secret, setSecret] = useState<string>("");

	const { data: bookingDetail, isLoading, error } = trpc.bookings.byId.useQuery({ id: bookingId });

	const { data: serviceData } = trpc.service.getAllServices.useQuery();

	const { data: userData } = getUserById(bookingDetail?.userId as string);

	const service = serviceData && serviceData?.find((service: Services) => service.id === bookingDetail?.serviceId);
	const servicePrice = Number(service?.price);

	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditBookingFormType>({
		resolver: zodResolver(editBookingsFormSchema)
	});

	const editBooking = trpc.bookings.editBooking.useMutation();

	const cancelBooking = trpc.bookings.cancelBooking.useMutation();

	const { data: invoiceData } = trpc.invoice.getByBookingId.useQuery({ bookingId: bookingId as string });

	console.log("invoice data", invoiceData);

	const verifyRecaptcha = trpc.recaptcha.verify.useMutation({
		onError(error) {
			console.log("error verify recaptcha mutation", error);
		}
	});

	useEffect(() => {
		const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;
		const secret = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET;

		if (!key) return;
		if (!secret) return;

		setKey(key);
		setSecret(secret);
	}, [key, secret]);

	const handleGenerateInvoice = async () => {
		const checkInDate = new Date(bookingDetail?.checkInDate as string);
		const checkOutDate = new Date(bookingDetail?.checkOutDate as string);
		const serviceDuration = calculateServiceDuration(checkInDate, checkOutDate);
		const subtotal = calculateSubtotal(servicePrice, serviceDuration);
		const taxAmount = calculateTaxAmount(subtotal);
		const total = calculateTotalAmount(subtotal + taxAmount);

		const invoice = {
			bookingId: bookingId,
			petName: invoiceData?.petName,
			serviceName: invoiceData?.serviceName as string,
			servicePrice: servicePrice,
			serviceDuration: serviceDuration,
			customerName: invoiceData?.customerName,
			customerEmail: invoiceData?.email as string,
			customerAddress: userData?.address as string,
			customerCity: userData?.city as string,
			subtotal,
			taxAmount,
			total,
			createdAt: new Date().toLocaleDateString() as string,
			dueDate: bookingDetail?.checkOutDate && new Date(bookingDetail?.checkOutDate).toLocaleDateString() as string,
		} as Invoice;

		Swal.fire({
			title: 'Are you sure you want to generate invoice?',
			showDenyButton: true,
			confirmButtonText: 'Yes',
		}).then((result) => {
			if (result.isConfirmed) {
				generateInvoice(invoice as Invoice);
				Swal.fire('Successfully Generated Invoice', '', 'success');
			}
		})
	}

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

					token && secret && verifyRecaptcha.mutate({ token, secret });

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
				Manage Booking: <span className="text-[rgb(103,163,161)]">{bookingDetail?.serviceName}</span>
			</h1>

			<nav className="text-md font-medium text-center text-gray-500 border-b border-gray-500 dark:text-gray-400 dark:border-gray-500">
				<ul className="flex flex-wrap">
					<li>
						<button onClick={handleShowEditBookingForm} className={`${showForm === true ? "text-gray-100 !border-gray-100 border-b-2" : ""} inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-100 hover:border-gray-100`}>Edit Booking</button>
					</li>
					<li>
						<button onClick={() => handleCancelBooking(bookingDetail?.id as string)} className={"hover:text-gray-100 !border-gray-100 hover:border-b-2 inline-block p-4 hover:border-b-2 borded-t-lg text-gray-transparent rounded-100 hover:border-gray-100"}>Cancel Booking</button>
					</li>
					<li>
						<button onClick={handleGenerateInvoice} className={"hover:text-gray-100 !border-gray-100 hover:border-b-2 inline-block p-4 hover:border-b-2 borded-t-lg text-gray-transparent rounded-100 hover:border-gray-100"}>Generate Invoice</button>
					</li>
				</ul>
			</nav>
			{key && key !== undefined && key !== "" && showForm ? (
				<GoogleReCaptchaProvider reCaptchaKey={key}>
					<EditBookingForm
						register={register}
						isSubmitting={isSubmitting}
						onSubmit={onSubmit}
						handleSubmit={handleSubmit}
						setShowForm={setShowForm}
						setToken={setToken}
					/>
				</GoogleReCaptchaProvider>
			) : null}
		</div>
	)
}

export default BookingDetail;