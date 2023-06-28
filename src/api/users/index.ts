import { trpc } from "../../utils/trpc";

export const getUserById = (id: string) => {
    const { data, isLoading, error } = trpc.user.byId.useQuery({ id });
    return { data, isLoading, error };
}

export const getAllUsers = () => {
    const { data, isLoading, error, refetch } = trpc.user.getAllUsers.useQuery();
    return { data, isLoading, error, refetch };
}

export const makeUserAdmin = (id: string, refetch: () => void) => {
    const { mutate } = trpc.user.makeUserAdmin.useMutation({
        onSuccess: () => refetch()
    });

    return mutate({ id });
}

export const removeUserAdmin = (id: string, refetch: () => void) => {
    const { mutate } = trpc.user.removeUserAdmin.useMutation({
        onSuccess: () => refetch()
    });

    return mutate({ id });
}