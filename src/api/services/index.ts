import { trpc } from "../../utils/trpc";

export const getAllServices = () => {
    const { data, isLoading, error } = trpc.service.getAllServices.useQuery();
    return { data, isLoading, error };
}

export const getServiceById = (id: string) => { 
    const { data, isLoading, error, refetch } = trpc.service.byId.useQuery({ id });
    return { data, isLoading, error, refetch };
}