import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod'
import { Pet, User } from '@prisma/client'
import router from 'next/router';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '../../../utils/trpc';
import Swal from 'sweetalert2';

interface UserDetail extends User {
    pets: Pet[]
}

type Props = {
    userDetail: UserDetail
}

const vetSchema = z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    phone: z.string().min(10).max(12),
    email: z.string().email(),
});

type FormData = z.infer<typeof vetSchema>;

const VetForm = ({ userDetail }: Props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(vetSchema),
    });

    const { userId } = useAuth();

    const addVetDetails = trpc.vet.create.useMutation({
        onSuccess: () => {
            Swal.fire({
                title: "Success!",
                text: "Your Vet Details have been saved to your profile!",
                icon: "success",
                confirmButtonText: "Ok",
                confirmButtonColor: "#1D4ED8",
            }).then(() => {
                router.push(`/profile/${userId}`);
            });
        }
    });

    const onSubmit = (data: FormData) => { }
    return (
        <div>VetForm</div>
    )
}

export default VetForm