import { trpc } from "../../utils/trpc";

export const getUserById = (id: string) => {
<<<<<<< HEAD
<<<<<<< HEAD
    const { data, isLoading, error, refetch } = trpc.user.byId.useQuery({ id });
    return { data, isLoading, error, refetch };
=======
    const { data, isLoading, error } = trpc.user.byId.useQuery({ id });
    return { data, isLoading, error };
>>>>>>> abe43e1 (extracted trpc logic related to users into its own functions)
=======
    const { data, isLoading, error, refetch } = trpc.user.byId.useQuery({ id });
    return { data, isLoading, error, refetch };
>>>>>>> cdf3b78 (added refetch to the getUserById function)
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