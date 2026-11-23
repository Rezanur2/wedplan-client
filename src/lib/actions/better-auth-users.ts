import { auth } from "../auth";
import { headers } from "next/headers";

export const getUsers = async () => {
    const users = await auth.api.listUsers({
        query: {
            sortBy: "name",
            sortDirection: "desc",
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });
    return users;
};