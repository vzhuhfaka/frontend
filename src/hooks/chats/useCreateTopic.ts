import { api } from "@/lib/api-client";
import { useState } from "react";

interface CreateTopicData {
    name: string;
}

export const useCreateTopic = (chatId: string) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [resCode, setResCode] = useState<number>();

    const createTopic = async (data: CreateTopicData) => {
        try {
            setLoading(true);
            setError(null);
            console.log(data)
            const response = await api.post(`/chats/${chatId}/topics/`, data);
            
            if (response) {
                setResCode(response.status);
                return response.data;
            }
        } catch (e) {
            console.error("Failed to create topic", e);
            setError("Failed to create topic");
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return { createTopic, resCode, error, loading };
};