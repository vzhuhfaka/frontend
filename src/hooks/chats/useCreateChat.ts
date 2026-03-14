import { api } from "@/lib/api-client";
import { useState } from "react";

interface CreateChatData {
    name: string;
    is_group?: boolean;
    member_ids?: number[]
}

export const useCreateChat = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [resCode, setResCode] = useState<number>();

    const createChat = async (data: CreateChatData) => {
        try {
            setLoading(true);
            setError(null);
            console.log(data)

            const payload = {
                ...data,
                is_group: data.is_group ?? true
            }
            const response = await api.post("/chats", payload);
            
            if (response) {
                setResCode(response.status);
                return response.data;
            }
        } catch (e) {
            console.error("Failed to create chat", e);
            setError("Failed to create chat");
            throw e; // Пробрасываем ошибку дальше
        } finally {
            setLoading(false);
        }
    };

    return { createChat, resCode, error, loading };
};