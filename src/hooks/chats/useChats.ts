import { useState, useEffect } from "react";

import { api } from "@/lib/api-client";


export interface Chat {
    id: number;
    name: string;
    lastMessage: string;
    lastMessageAuthor: string;
    time: string;
    members: number;
    unread: number
}

// Хук для получения списка чатов
export const useChats = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true);
                const response: any = await api.get("/chats");
                
                if (Array.isArray(response.chats)) {
                    setChats(response.chats);
                }
                // else if (response && Array.isArray(response.chats)) {
                //     setChats(response.chats)
                // }

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

    return { chats, loading, error };
};