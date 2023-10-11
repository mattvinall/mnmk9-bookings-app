import React, { useEffect, useState } from 'react'
import { getAllUsers } from '../../../api/users';
import { getAllServices } from '../../../api/services';
import { AdminBookingFormType } from '../../../utils/schema';
import { useForm } from 'react-hook-form';
import { Pet, Services, User } from '@prisma/client';
import LoadingSpinner from '../../client/ui/LoadingSpinner';
import { trpc } from '../../../utils/trpc';
import Swal from 'sweetalert2';

interface UserData extends User {
    pets: Pet[]
}

type Props = {
    secret: string
}

const AdminBookingForm = ({ secret }: Props) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);


    const { data: users, isLoading, refetch } = getAllUsers();
    const { data: services, isLoading: loading } = getAllServices()

    useEffect(() => {
        const user = users?.filter((user: User) => user.id === userId)[0];
        console.log("user found", user);
        setUserData(user);

        const { email, phoneNumber } = user || {};

        setValue("email", email)
        setValue("phoneNumber", phoneNumber)

    }, [userId]);

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<AdminBookingFormType>();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        id && setUserId(id as string);
    }

    const createBooking = trpc.bookings.newAdminBooking.useMutation({
        onSuccess: () => refetch()
    })

    const onSubmit = async (data: AdminBookingFormType) => {

        if (!userData || userData?.pets?.length === 0) return;

        try {
            data.petName = data.petName.split("-")[0] as string;
            data.serviceName = data.serviceName.split("-")[0] as string;
            const userId = userData && userData?.id as string;
            const name = userData && userData?.name as string;
            const petId = userData && userData?.pets?.length > 0 ? users.filter((user: User) => user.id === userId)[0].pets[0].id as string : "";
            const service = services && services?.length > 0 && services?.filter((service: Services) => service.serviceName === data.serviceName);
            const serviceId = service && service?.length > 0 && service[0]?.id as string;

            petId && serviceId && userId && await createBooking.mutateAsync({
                ...data,
                firstName: name?.split(" ")[0] || "",
                lastName: name?.split(" ")[1] || "",
                userId,
                petId,
                serviceId,
            });

            Swal.fire({
                icon: 'success',
                title: 'Booking created successfully',
                showConfirmButton: false,
            })

            reset()

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        }

        console.log("booking created");
    };

    return (
        <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-16">
                Book a<span className="text-[rgb(238,182,43)]"> Service</span>
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-[80%]">
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 mb-6 w-full group">
                        <label htmlFor="user" className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Select User
                        </label>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <select
                                    id="user"
                                    {...register('name', { required: true })}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                                    onChange={handleChange}
                                >
                                    <option value="">Select a client</option>
                                    {users?.map((user: User) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                                <svg
                                    style={{ fill: "#fff", position: "absolute", right: "0", bottom: "15px", height: "20px" }}
                                    className="ml-2 w-4 h-4"
                                    aria-hidden="true"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2" d="M19 9l-7 7-7-7">
                                    </path>
                                </svg>
                                {errors.name && (
                                    <span className="text-red-500 text-sm">Please select a user</span>
                                )}
                            </>
                        )}
                    </div>
                    <div className="relative z-0 mb-6 w-full group">
                        <label htmlFor="service" className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Service
                        </label>
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <select
                                    id="service"
                                    {...register('serviceName', { required: true })}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                                >
                                    <option value="">Select a service</option>
                                    {services?.map((service: Services) => (
                                        <option key={service.id} value={`${service.serviceName}-${service.id}`}>
                                            {service.serviceName}
                                        </option>
                                    ))}
                                </select>
                                <svg
                                    style={{ fill: "#fff", position: "absolute", right: "0", bottom: "15px", height: "20px" }}
                                    className="ml-2 w-4 h-4"
                                    aria-hidden="true"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2" d="M19 9l-7 7-7-7">
                                    </path>
                                </svg>
                                {errors && errors.serviceName && (
                                    <span className="text-red-500 text-sm">Please select a service</span>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 mb-6 w-full group">
                        <input
                            {...register("phoneNumber", { required: true })}
                            type="tel"
                            name="phoneNumber"
                            id="phone"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        />
                        <label
                            htmlFor="phone"
                            className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Phone number
                        </label>
                    </div>
                    <div className="relative z-0 mb-6 w-full group">
                        <input
                            {...register("email", { required: true })}
                            type="email"
                            name="email"
                            id="email"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        />
                        <label
                            htmlFor="email"
                            className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Email address
                        </label>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 mb-6 w-full group">
                        <input
                            {...register("checkInDate", { required: true })}
                            type="date"
                            name="checkInDate"
                            id="checkInDate"
                            className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                            required
                        />
                        <label
                            htmlFor="checkInDate"
                            className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Check In Date
                        </label>
                    </div>
                    <div className="relative z-0 mb-6 w-full group">
                        <input
                            {...register("checkOutDate", { required: true })}
                            type="date"
                            name="checkOutDate"
                            id="checkOutDate"
                            className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                            required
                        />
                        <label
                            htmlFor="checkOutDate"
                            className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Check Out Date
                        </label>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 mb-6 w-full group">
                        <input
                            {...register("startTime", { required: true })}
                            type="time"
                            name="startTime"
                            id="startTime"
                            className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                            required
                        />
                        <label
                            htmlFor="startTime"
                            className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Drop Off Time
                        </label>
                    </div>
                    <div className="relative z-0 mb-6 w-full group">
                        <input
                            {...register("endTime", { required: true })}
                            type="time"
                            name="endTime"
                            id="endTime"
                            className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                            required
                        />
                        <label
                            htmlFor="endTime"
                            className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Pick Up Time
                        </label>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 mb-6 w-full group">
                        <label
                            htmlFor="pet-select"
                            className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Select Pet
                        </label>
                        <select
                            {...register("petName", { required: true })}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                            id="pet-select"
                        >
                            <option value="" disabled selected>Select Pet</option>
                            {userData?.pets && userData?.pets?.map((pet: Pet) => {
                                const { name, id } = pet;
                                return (
                                    <option key={name} className="text-gray-900 w-[10%]" value={`${name}-${id}`}>{name}</option>
                                )
                            })}
                        </select>
                        <svg
                            style={{ fill: "#fff", position: "absolute", right: "0", bottom: "15px", height: "20px" }}
                            className="ml-2 w-4 h-4"
                            aria-hidden="true"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2" d="M19 9l-7 7-7-7">
                            </path>
                        </svg>
                    </div>
                    <div className="relative z-0 mb-6 w-full group">
                        <textarea
                            {...register("notes")}
                            rows={1}
                            name="notes"
                            id="notes"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                        />
                        <label
                            htmlFor="notes"
                            className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Notes/Special Instructions
                        </label>
                    </div>
                </div>
                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="mt-[25px] rounded-full bg-gradient-to-l from-[#A70D0E] to-[#EEB62B] hover:bg-gradient-to-r from-[#EEB62B] to-[#A70D0E] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default AdminBookingForm;