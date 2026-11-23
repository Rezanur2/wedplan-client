
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";


export const getAllUsers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users`, {
            cache: "no-store",
        });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
};

export const getUserPremiumById = async (userId: string) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/premium`, {
        cache: "no-store",
    });
    return response.json();
}