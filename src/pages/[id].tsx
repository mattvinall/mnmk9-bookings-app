import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

const UserDetail: NextPage = () => {
	const router = useRouter();
	const userId = router.query.id as string;
	const { data: userDetail, isLoading, error } = trpc.user.byId.useQuery({ id: userId });

	if (isLoading) return <>Loading...</>

	if (error) return <>Error {error}</>

	return (
		<h1>Detail Page</h1>
	)

}

export default UserDetail;