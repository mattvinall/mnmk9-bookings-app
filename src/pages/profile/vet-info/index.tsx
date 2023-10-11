import React from 'react'
import VetForm from '../../../components/client/forms/VetForm';
import { NextPage } from 'next';
import { useAuth } from '@clerk/nextjs';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const VetInfo: NextPage = () => {
    const { isSignedIn } = useAuth();
    const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY as string;
    return (
        isSignedIn && key ? (
            <section className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] py-16">
                    Add <span className="text-[rgb(238,182,43)]">Vet Information</span>
                </h1>
                <GoogleReCaptchaProvider reCaptchaKey={key}>
                    <VetForm />
                </GoogleReCaptchaProvider>
            </section>
        ) : (
            <div className="container text-center">Please Login</div>
        )
    )
}

export default VetInfo