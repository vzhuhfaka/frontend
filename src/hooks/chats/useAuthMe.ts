import { useEffect, useState } from "react"

import { api } from "@/lib/api-client"


interface AuthResponse {
    "id": number,
    "email": string,
    "first_name": string,
    "middle_name": string,
    "last_name": string
}

export const useAuthMe = () => {
    const [authMe, setAuthMe] = useState<AuthResponse>({
        "id": 0,
        "email": '',
        "first_name": '',
        "middle_name": '',
        "last_name": ''
    })
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true);
                const response = await api.get("/auth/me") as AuthResponse;
                
                setAuthMe(response);

                setError(null);
            } catch (err) {
                setError("Failed to load chats");
                console.error("Error fetching chats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    return { authMe, loading, error };
}