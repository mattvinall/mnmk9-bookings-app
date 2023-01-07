import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const PetDetail = () => {
	const router = useRouter();
	const id = router.query.id as string;
	const { data: petDetail, isLoading, error } = trpc.pet.byId.useQuery({ id });

	console.log("pet detail", petDetail);

}

export default PetDetail
