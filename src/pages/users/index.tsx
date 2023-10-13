"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import usePagination from "../../hooks/usePagination";
import Pagination from "@mui/material/Pagination";
import { Pet } from "../../types/router";
import { useAuth } from "@clerk/nextjs";
import { getUserById, getAllUsers } from "../../api/users";
import { trpc } from "../../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import LoadingSpinner from "../../components/client/ui/LoadingSpinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";

const Users = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<[]>([]);
    const [showAddUserForm, setShowAddUserForm] = useState<boolean>(false);

    // useAuth hook to extract user id and isSignedIn from clerk
    const { userId, isSignedIn } = useAuth();

    // fetch all users
    const { data: allUserData, refetch } = getAllUsers();

    // fetch user by id to check if admin role
    const { data: userData, isLoading, error } = getUserById(userId as string);

    const { mutate } = trpc.user.makeUserAdmin.useMutation({
        onSuccess: () => refetch()
    });

    const { mutate: removeAdmin } = trpc.user.removeUserAdmin.useMutation({
        onSuccess: () => refetch()
    });

    const { mutate: addUser } = trpc.user.createUser.useMutation({
        onSuccess: () => refetch()
    });

    // pagination setup
    const ITEMS_PER_PAGE = 6;
    const { currentPage, getCurrentData, changePage, pageCount } = usePagination(allUserData, ITEMS_PER_PAGE)
    const currentData = getCurrentData();

    const onPageChange = (event: any, value: number) => {
        changePage(value);

        setSearchResults([]);
        setSearchTerm("");
    }

    // handle search handler
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchTerm(query);

        const filteredUsers = allUserData?.filter((user: any) => {
            const userPets = user.pets.map((pet: Pet) => pet.name.toLowerCase());
            return (
                user.name.toLowerCase().includes(query.toLowerCase()) ||
                userPets.includes(query.toLowerCase())
            );
        });
        setSearchResults(filteredUsers as []);
    };

    // handle add user form
    const handleAddUser = () => {
        setShowAddUserForm(true);
    };

    type AddNewUserFormType = {
        name: string;
        email: string;
    }

    const addNewUserFormSchema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters long").max(50, "Name must be less than 50 characters long"),
        email: z.string().email("Please enter a valid email address")
    });

    const { register, handleSubmit, reset } = useForm<AddNewUserFormType>({
        resolver: zodResolver(addNewUserFormSchema)
    });

    const onSubmit: SubmitHandler<AddNewUserFormType> = async (formData: AddNewUserFormType) => {
        try {
            const { name, email } = formData;

            if (!name || !email) return;

            console.log("name", name);
            console.log("email", email);

            await addUser({ name, email });
            reset();

            // success message 
            Swal.fire({
                icon: 'success',
                title: `Success!`,
                text: `Successfully added a user`,
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
        <LoadingSpinner />
    );

    if (!isSignedIn) return (
        <div className="container text-center">
            <h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Please Login....</h1>
        </div>
    );

    if (error) return (
        <div className="container text-center">
            <h1 className="text-1xl font-extrabold mt-[15%] tracking-tight text-white sm:text-[2rem]">Error....please contact support</h1>
        </div>
    );

    return (
        <>
            {userData?.role === "admin" && isSignedIn ? (
                <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        MNMK-9  <span className="text-[rgb(238,182,43)]">Users</span>
                    </h1>
                    <div className="flex justify-between items-center w-3/4">
                        <>
                            <label htmlFor="simple-search" className="sr-only">Search</label>
                            <div className="relative w-full mr-4">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-100" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                                </div>
                                <input onChange={handleSearch} value={searchTerm} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by user or pet..." required />
                            </div>
                        </>
                        <button onClick={handleAddUser} className="bg-gray-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            +
                        </button>
                    </div>
                    {showAddUserForm ? (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 mb-6 w-full group">
                                    <input
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                                        type="text"
                                        id="new-user-name"
                                        {...register("name")}
                                    />
                                    <label
                                        htmlFor="new-user-name"
                                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Name:
                                    </label>
                                </div>
                                <div className="relative z-0 mb-6 w-full group">

                                    <input
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-100 peer"
                                        type="email"
                                        id="new-user-email"
                                        {...register("email")}
                                    />
                                    <label
                                        className="peer-focus:font-medium absolute text-sm text-gray-100 dark:text-gray-100 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        htmlFor="new-user-email"
                                    >
                                        Email:
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-[25px] rounded-full bg-gradient-to-l from-[#A70D0E] to-[#EEB62B] hover:bg-gradient-to-r from-[#EEB62B] to-[#A70D0E] px-16 py-3 font-semibold text-white no-underline transition py-3 px-5 text-sm font-medium text-center rounded-lg bg--700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Add User
                            </button>
                        </form>
                    ) : null}

                    {/* display results */}
                    <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 md:gap-8 mt-10">
                        {searchTerm && searchResults && searchResults?.length > 0 ? searchResults?.map((user: any, index: number) => (
                            <li key={user?.id} className="relative flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-2 text-white hover:bg-white/20">
                                <div className="flex justify-center">
                                    <div className="rounded-lg shadow-lg bg-white max-w-md w-[350px] h-full min-h-[375px]">
                                        <Image className="rounded-full scale-50 float-right" width={150} height={150} src={user?.image as string || `https://mnmk9-bookings.s3.ca-central-1.amazonaws.com/images/default-profile-image.jpg`} alt={`profile image of ${user.name}`} />
                                        <div className="p-6">
                                            <h2 className="mt-6 text-gray-900 text-xl font-bold mb-2">{user?.name}</h2>
                                            {user?.phoneNumber ? <p className="text-gray-700 font-medium text-base mb-4">{user?.phoneNumber}</p> : <p className="text-gray-700 font-medium mb-4">No phone number added...</p>}
                                            {user?.address && user?.city && user?.postalCode ? <p className="text-gray-700 text-base mb-4">{user?.address}, {user?.city}. {user?.postalCode}</p> : <div><p className="text-gray-900">No Address Added...</p><br /></div>}
                                            <h3 className="text-gray-900 font-bold">Pets:</h3>
                                            <ul className="flex flex-wrap pl-[0px]">
                                                {user && user?.pets?.length > 0 ? user?.pets?.map((pet: Pet, index: number) => <li key={pet.id}><a href={`/pet/${pet.id}`}><Image width={75} height={75} className="w-[75px] h-[75px] rounded-full scale-50" src={pet.profileImage as string || `https://mdbootstrap.com/img/new/standard/nature/19${index}.jpg`} alt={`profile image of pet ${pet.name}`} /><p className="text-gray-900 font-medium text-center">{pet.name}</p></a></li>) : <p className="text-gray-900 font-medium">No pets added to profile...</p>}
                                            </ul>
                                            {user?.role === "user" ? (
                                                <button
                                                    className="absolute top-[-25px] right-0 bg-gray-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                                                    onClick={() => mutate({ id: user.id })}
                                                >
                                                    Make Admin
                                                </button>
                                            ) : (
                                                <button
                                                    className="absolute top-[-25px] right-0 bg-gray-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                                                    onClick={() => removeAdmin({ id: user.id })}
                                                >
                                                    Remove Admin
                                                </button>
                                            )
                                            }
                                            <Link className="absolute top-[-25px] left-0 bg-gray-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4" href={`/profile/${user.id}`}>User Details</Link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )) : (
                            currentData?.map((user: any, idx: number) => (
                                <li key={user?.id} className="relative flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-2 text-white hover:bg-white/20">
                                    <div className="flex justify-center">
                                        <div className="rounded-lg shadow-lg bg-white max-w-md w-[350px] h-full min-h-[375px]">
                                            <Image className="rounded-full scale-50 float-right" width={150} height={150} src={user?.image as string || `https://mnmk9-bookings.s3.ca-central-1.amazonaws.com/images/default-profile-image.jpg`} alt={`profile image of ${user.name}`} />
                                            <div className="p-6">
                                                <h2 className="mt-6 text-gray-900 text-xl font-bold mb-2">{user?.name}</h2>
                                                {user?.phoneNumber ? <p className="text-gray-700 font-medium text-base mb-4">{user?.phoneNumber}</p> : <p className="text-gray-700 font-medium mb-4">No phone number added...</p>}
                                                {user?.address && user?.city && user?.postalCode ? <p className="text-gray-700 text-base mb-4">{user?.address}, {user?.city}. {user?.postalCode}</p> : <div><p className="text-gray-900">No Address Added...</p><br /></div>}
                                                <h3 className="text-gray-900 font-bold">Pets:</h3>
                                                <ul className="flex flex-wrap pl-[0px]">
                                                    {user?.pets && user?.pets?.length > 0 ? user?.pets?.map((pet: Pet, index: number) => <li key={pet.id as string}><a href={`/pet/${pet.id as string}`}><Image width={75} height={75} className="w-[75px] h-[75px] rounded-full scale-50" src={pet.profileImage as string || `https://mdbootstrap.com/img/new/standard/nature/19${index}.jpg`} alt={`profile image of pet ${pet.name}`} /><p className="text-gray-900 font-medium text-center">{pet.name}</p></a></li>) : <p className="text-gray-900 font-medium">No pets added to profile...</p>}
                                                </ul>
                                                {user?.role === "user" ? (
                                                    <button
                                                        className="absolute top-[-25px] right-0 bg-gray-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                                                        onClick={() => mutate({ id: user.id })}
                                                    >
                                                        Make Admin
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="absolute top-[-25px] right-0 bg-gray-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                                                        onClick={() => removeAdmin({ id: user.id })}
                                                    >
                                                        Remove Admin
                                                    </button>
                                                )
                                                }
                                                <Link className="absolute top-[-25px] left-0 bg-gray-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4" href={`/profile/${user.id}`}>User Details</Link>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                    <Pagination
                        count={pageCount}
                        size="large"
                        page={currentPage}
                        variant="outlined"
                        color="secondary"
                        shape="rounded"
                        onChange={onPageChange}
                    />
                </div>
            ) : (
                <div className="container flex flex-col items-center text-center justify-start gap-12 px-4 py-[32vh]">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Error 403: Forbidden</h1>
                </div>
            )}
        </>
    )
}

export default Users;