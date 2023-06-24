import { Pet, User } from '@prisma/client'
import React from 'react'

interface UserDetail extends User {
    pets: Pet[]
}

type Props = {
    userDetail: UserDetail
}

const VaccineForm = ({ userDetail }: Props) => {
    const onSubmit = (data: FormData) => {
        console.log(data);
    };
    return (
        <div>VaccineForm</div>
    )
}

export default VaccineForm