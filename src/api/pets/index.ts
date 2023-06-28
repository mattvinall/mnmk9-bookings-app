import { trpc } from "../../utils/trpc";

export const getPetById = (id: string) => {
    const { data, isLoading, error } = trpc.pet.byId.useQuery({ id });
    return { data, isLoading, error };
}

export const getAllPets = () => {
    const { data, isLoading, error } = trpc.pet.getAllPets.useQuery();
    return { data, isLoading, error };
}