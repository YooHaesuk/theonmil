import { UserAddress, User } from "@shared/schema";

export const getAddresses = async (userId: string): Promise<UserAddress[]> => {
    const response = await fetch(`/api/users/addresses/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch addresses");
    return response.json();
};

export const addAddress = async (address: Omit<UserAddress, "id" | "createdAt">): Promise<UserAddress> => {
    const response = await fetch("/api/users/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
    });
    if (!response.ok) throw new Error("Failed to add address");
    return response.json();
};

export const deleteAddress = async (id: number): Promise<void> => {
    const response = await fetch(`/api/users/addresses/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete address");
};

export const updateProfile = async (id: string, data: Partial<User>): Promise<User> => {
    const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return response.json();
};
